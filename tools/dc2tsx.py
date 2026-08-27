#!/usr/bin/env python3
"""
Converte um arquivo .dc.html do Claude Design em um componente React (TSX).

O objetivo é transliteração fiel, não reinterpretação: cada `style="..."`
inline vira um objeto de estilo com os mesmos valores, a estrutura de tags é
preservada, e os textos saem idênticos.

O que é traduzido:

  style="a:b"            -> style={{ a: 'b' }}          (convertido aqui, estático)
  style="{{ x }}"        -> style={css(v.x)}            (dinâmico, convertido em runtime)
  style-hover="a:b"      -> classe CSS gerada com :hover
  onClick="{{ x }}"      -> onClick={v.x}
  <sc-for list="{{ xs }}" as="p"> -> {v.xs.map((p, i) => (...))}
  {{ x }} em texto       -> {v.x}
  class=                 -> className=

Uso: python3 tools/dc2tsx.py <arquivo.dc.html> <Componente> > saida.tsx
"""
import html
import re
import sys
from html.parser import HTMLParser

VAZIAS = {'br', 'img', 'input', 'hr', 'meta', 'link', 'circle', 'path', 'rect',
          'stop', 'line', 'polygon', 'ellipse', 'use', 'image', 'source'}

# atributos HTML -> React
RENOMEAR = {
    'class': 'className', 'for': 'htmlFor', 'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
    'stop-color': 'stopColor', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule',
    'stroke-dasharray': 'strokeDasharray', 'text-anchor': 'textAnchor',
    'font-size': 'fontSize', 'font-weight': 'fontWeight', 'xmlns:xlink': 'xmlnsXlink',
    'gradientunits': 'gradientUnits', 'gradientUnits': 'gradientUnits',
    'crossorigin': 'crossOrigin', 'maxlength': 'maxLength', 'readonly': 'readOnly',
    'colspan': 'colSpan', 'rowspan': 'rowSpan', 'tabindex': 'tabIndex',
    'aria-label': 'aria-label', 'viewbox': 'viewBox', 'preserveaspectratio': 'preserveAspectRatio',
    'backface-visibility': 'backfaceVisibility',
    # o HTMLParser rebaixa os nomes de atributo; devolve o camelCase do React
    'onclick': 'onClick', 'onmouseenter': 'onMouseEnter', 'onmouseleave': 'onMouseLeave',
    'onmousedown': 'onMouseDown', 'onmouseup': 'onMouseUp', 'onchange': 'onChange',
    'onfocus': 'onFocus', 'onblur': 'onBlur', 'oninput': 'onInput', 'onkeydown': 'onKeyDown',
    'ondragstart': 'onDragStart', 'ondragover': 'onDragOver', 'ondrop': 'onDrop',
}

IGNORAR = {'hint-placeholder-count', 'hint-placeholder-val', 'data-dc-script', 'data-props'}

# O HTMLParser rebaixa os nomes de tag; o SVG precisa do camelCase de volta.
TAGS_SVG = {
    'lineargradient': 'linearGradient', 'radialgradient': 'radialGradient',
    'clippath': 'clipPath', 'foreignobject': 'foreignObject',
    'fegaussianblur': 'feGaussianBlur', 'feoffset': 'feOffset',
    'femerge': 'feMerge', 'femergenode': 'feMergeNode', 'fedropshadow': 'feDropShadow',
    'textpath': 'textPath', 'lineargradient ': 'linearGradient',
}

# Os href do design apontam para outros .dc.html. Viram bindings, e o hook
# decide a rota real (algumas telas do design ainda não existem no app).
LINKS = {
    './Cliente Meus projetos.dc.html': 'hrefProjetos',
    './Cliente Detalhe do projeto.dc.html': 'hrefDetalhe',
    './Cliente Editor.dc.html': 'hrefEditor',
    './Cliente Entrar.dc.html': 'hrefEntrar',
    './Cliente Preview.dc.html': 'hrefPreview',
    './Cliente Revisao.dc.html': 'hrefRevisao',
    './Cliente Galeria de fotos.dc.html': 'hrefGaleria',
    './Cliente Criar album.dc.html': 'hrefCriarAlbum',
    './Cliente Compartilhar.dc.html': 'hrefCompartilhar',
    './Cliente Ajuda.dc.html': 'hrefAjuda',
    './Cliente Minha conta.dc.html': 'hrefConta',
    './Cliente Finalizar projetos.dc.html': 'hrefFinalizar',
}

BIND = re.compile(r'^\s*\{\{\s*([^}]+?)\s*\}\}\s*$')
BIND_INLINE = re.compile(r'\{\{\s*([^}]+?)\s*\}\}')


def css_para_objeto(texto: str) -> str:
    """'color:red;font-size:12px' -> "{ color: 'red', fontSize: '12px' }" """
    pares = []
    for decl in re.split(r';(?![^(]*\))', texto):
        decl = decl.strip()
        if not decl or ':' not in decl:
            continue
        prop, _, val = decl.partition(':')
        prop, val = prop.strip(), val.strip()
        if not prop:
            continue
        if prop.startswith('--'):
            chave = f"'{prop}'"
        else:
            partes = prop.split('-')
            camel = partes[0] + ''.join(p.capitalize() for p in partes[1:])
            chave = camel if re.match(r'^[A-Za-z_$][A-Za-z0-9_$]*$', camel) else f"'{prop}'"
        val = val.replace('\\', '\\\\').replace("'", "\\'")
        pares.append(f"{chave}: '{val}'")
    return '{ ' + ', '.join(pares) + ' }'


def expr(valor: str) -> str:
    """Resolve o conteúdo de um binding para uma expressão JS."""
    v = valor.strip()
    if re.match(r'^[a-zA-Z_$][\w$]*(\.[a-zA-Z_$][\w$]*|\[\d+\])*$', v):
        raiz = re.split(r'[.\[]', v)[0]
        return v if raiz in expr.locais else f'v.{v}'
    return v


expr.locais = set()


class Conversor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.saida = []
        self.pilha = []
        self.nivel = 1
        self.regras = []       # CSS gerado para :hover / :focus
        self.n_classe = 0
        self.fechar_map = []   # o que emitir ao fechar um sc-for

    # ---------- utilidades ----------
    def emitir(self, txt):
        self.saida.append('  ' * self.nivel + txt)

    def classe_pseudo(self, hover, focus):
        self.n_classe += 1
        nome = f'dc{self.n_classe}'
        if hover:
            self.regras.append(f'.{nome}:hover {{ {hover} }}')
        if focus:
            self.regras.append(f'.{nome}:focus, .{nome}:focus-within {{ {focus} }}')
        return nome

    # ---------- tags ----------
    def handle_starttag(self, tag, attrs):
        tag = TAGS_SVG.get(tag, tag)
        d = dict(attrs)

        if tag == 'sc-for':
            lista = d.get('list', '')
            m = BIND.match(lista)
            fonte = expr(m.group(1)) if m else '[]'
            item = d.get('as', 'item')
            expr.locais.add(item)
            self.emitir(f'{{{fonte}.map(({item}: any, i{self.nivel}: number) => (')
            self.nivel += 1
            self.pilha.append(('sc-for', item))
            return

        if tag in ('helmet', 'x-dc'):
            self.pilha.append((tag, None))
            return

        props = []
        hover = d.pop('style-hover', None)
        focus = d.pop('style-focus', None)
        classe_extra = None
        if hover or focus:
            classe_extra = self.classe_pseudo(hover, focus)

        for k, val in d.items():
            if k in IGNORAR:
                continue
            nome = RENOMEAR.get(k, k)

            if k == 'style':
                m = BIND.match(val)
                if m:
                    props.append(f'style={{css({expr(m.group(1))})}}')
                else:
                    props.append(f'style={{{css_para_objeto(val)}}}')
                continue

            if k == 'class':
                if classe_extra:
                    props.append(f'className="{val} {classe_extra}"')
                    classe_extra = None
                else:
                    props.append(f'className="{val}"')
                continue

            if k == 'href' and val in LINKS:
                props.append(f'{nome}={{v.{LINKS[val]}}}')
                continue

            m = BIND.match(val)
            if m:
                props.append(f'{nome}={{{expr(m.group(1))}}}')
            elif BIND_INLINE.search(val):
                partes = BIND_INLINE.sub(lambda mm: '${' + expr(mm.group(1)) + '}', val)
                props.append(f'{nome}={{`{partes}`}}')
            else:
                v = html.unescape(val).replace('"', '&quot;')
                props.append(f'{nome}="{v}"')

        if classe_extra:
            props.append(f'className="{classe_extra}"')

        if self.pilha and self.pilha[-1][0] == 'sc-for':
            props.insert(0, f'key={{i{self.nivel - 1}}}')

        attr_txt = (' ' + ' '.join(props)) if props else ''
        if tag in VAZIAS:
            self.emitir(f'<{tag}{attr_txt} />')
        else:
            self.emitir(f'<{tag}{attr_txt}>')
            self.nivel += 1
            self.pilha.append((tag, None))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VAZIAS and self.pilha and self.pilha[-1][0] == tag:
            self.pilha.pop()
            self.nivel -= 1

    def handle_endtag(self, tag):
        tag = TAGS_SVG.get(tag, tag)
        if not self.pilha:
            return
        topo, item = self.pilha[-1]
        if topo in ('helmet', 'x-dc') and tag == topo:
            self.pilha.pop()
            return
        if tag == 'sc-for' and topo == 'sc-for':
            self.pilha.pop()
            expr.locais.discard(item)
            self.nivel -= 1
            self.emitir('))}')
            return
        if tag in VAZIAS:
            return
        self.pilha.pop()
        self.nivel -= 1
        self.emitir(f'</{tag}>')

    def handle_data(self, texto):
        if not texto.strip():
            return
        if self.pilha and self.pilha[-1][0] in ('style', 'script'):
            return
        t = html.unescape(texto).strip()
        t = t.replace('{', '&#123;').replace('}', '&#125;')
        t = re.sub(r'&#123;&#123;\s*([^&]+?)\s*&#125;&#125;',
                   lambda m: '{' + expr(m.group(1)) + '}', t)
        t = t.replace('&#123;', '{&#39;{&#39;}').replace('&#125;', '{&#39;}&#39;}')
        self.emitir(t)

    def handle_entityref(self, nome):
        self.emitir(html.unescape(f'&{nome};'))

    def handle_charref(self, nome):
        self.emitir(html.unescape(f'&#{nome};'))


def main():
    caminho, componente = sys.argv[1], sys.argv[2]
    bruto = open(caminho, encoding='utf-8').read()
    corpo = bruto.split('<x-dc>')[1].split('</x-dc>')[0]
    corpo = re.sub(r'<helmet>[\s\S]*?</helmet>', '', corpo)

    c = Conversor()
    c.feed(corpo)

    print(f"// Gerado por tools/dc2tsx.py a partir de {caminho.split('/')[-1]}")
    print('// Transliteração fiel do design: não editar à mão, editar o .dc.html.')
    print("'use client';\n")
    print("import { css } from '@/lib/css';\n")
    if c.regras:
        print('export const CSS_PSEUDO = `')
        for r in c.regras:
            print(r)
        print('`;\n')
    print(f'export default function {componente}({{ v }}: {{ v: any }}) {{')
    print('  return (')
    print('    <>')
    for linha in c.saida:
        print('    ' + linha)
    print('    </>')
    print('  );')
    print('}')


if __name__ == '__main__':
    main()
