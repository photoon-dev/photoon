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
import json
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
    'vector-effect': 'vectorEffect',
    'backface-visibility': 'backfaceVisibility',
    # o HTMLParser rebaixa os nomes de atributo; devolve o camelCase do React
    'onsubmit': 'onSubmit', 'onreset': 'onReset', 'inputmode': 'inputMode',
    # formulário não controlado: o valor inicial vem do banco e o React só lê no envio
    'defaultvalue': 'defaultValue', 'defaultchecked': 'defaultChecked',
    'autocomplete': 'autoComplete', 'autofocus': 'autoFocus', 'novalidate': 'noValidate',
    'onclick': 'onClick', 'onmouseenter': 'onMouseEnter', 'onmouseleave': 'onMouseLeave',
    'onmousedown': 'onMouseDown', 'onmouseup': 'onMouseUp', 'onchange': 'onChange',
    'onfocus': 'onFocus', 'onblur': 'onBlur', 'oninput': 'onInput', 'onkeydown': 'onKeyDown',
    'ondragstart': 'onDragStart', 'ondragover': 'onDragOver', 'ondrop': 'onDrop',
    'ondragend': 'onDragEnd', 'ondragleave': 'onDragLeave',
    'oncontextmenu': 'onContextMenu', 'ondblclick': 'onDoubleClick', 'ondoubleclick': 'onDoubleClick',
    'onpointerdown': 'onPointerDown', 'onpointermove': 'onPointerMove', 'onpointerup': 'onPointerUp',
    'onwheel': 'onWheel',
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
    # Declaração repetida no mesmo style: em CSS a última vence, num objeto JS
    # o TypeScript recusa ("multiple properties with the same name"). O design
    # traz isso quando um card herda o padding do cartão e o sobrescreve.
    pares = {}
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
        pares[chave] = f"{chave}: '{val}'"
    return '{ ' + ', '.join(pares.values()) + ' }'


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
        # `<image-slot>` é o marcador de imagem do Claude Design: um elemento
        # próprio que existe só no protótipo, para mostrar um retângulo cinza.
        # No produto o lugar é preenchido por foto de verdade, então ele vira um
        # `<span>` com o rótulo — que o binding depois substitui.
        if tag == 'image-slot':
            rotulo = dict(attrs).get('placeholder', '')
            self.emitir(
                '<span style={{ display: "flex", alignItems: "center", '
                'justifyContent: "center", width: "100%", height: "100%", '
                'fontSize: "12px", color: "#9AA7BC" }}>'
                f'{rotulo}</span>'
            )
            return

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

        if tag == 'sc-if':
            m = BIND.match(d.get('value', ''))
            cond = expr(m.group(1)) if m else 'false'
            self.emitir(f'{{Boolean({cond}) && (')
            self.emitir('  <>')
            self.nivel += 2
            self.pilha.append(('sc-if', None))
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

            # Atributo booleano do HTML (`readonly`, `disabled`): vem sem valor.
            # No JSX ele precisa do literal, senão vira string vazia.
            if val is None:
                props.append(f'{nome}={{true}}')
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
        if tag == 'sc-if' and topo == 'sc-if':
            self.pilha.pop()
            self.nivel -= 2
            self.emitir('  </>')
            self.emitir(')}')
            return
        if tag == 'sc-for' and topo == 'sc-for':
            self.pilha.pop()
            expr.locais.discard(item)
            self.nivel -= 1
            self.emitir('))}')
            return
        if tag in VAZIAS:
            return

        # O fechamento não bate com o topo da pilha.
        #
        # Dois arquivos exportados do design (Pedido e Pedidos) têm um `<div>`
        # sem par no meio do documento. O HTML tolera — o navegador fecha
        # sozinho ao encontrar o pai. O JSX não: o TypeScript recusa a tela
        # inteira com "no corresponding closing tag".
        #
        # Fechar aqui, no lugar certo do aninhamento, é o que o navegador faria.
        # Corrigir os .dc.html à mão não serve: a próxima exportação do design
        # traria o defeito de volta.
        if topo != tag:
            profundidade = next(
                (i for i, (t, _) in enumerate(reversed(self.pilha)) if t == tag), None
            )
            # A tag nem está aberta: fechamento órfão, ignora.
            if profundidade is None:
                return
            for _ in range(profundidade):
                aberta, _item = self.pilha.pop()
                self.nivel -= 1
                self.emitir(f'</{aberta}>')

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


def aplicar_slots(saida, slots):
    """
    Troca o conteúdo de um container por um binding.

    O design traz os cards com conteúdo fixo (três álbuns escritos à mão).
    O slot localiza o container pela própria linha de abertura e substitui
    todos os filhos por `{v.<binding>}`; o hook renderiza os cards reais com
    o mesmo markup, extraído para um componente próprio.

    Config por slot:
      container  trecho que identifica a linha de abertura do container
      ocorrencia qual ocorrência usar (0 = primeira)
      binding    nome do valor em `v`
      modo       'replace' (padrão) troca os filhos; 'append' acrescenta ao fim
    """
    for slot in slots:
        achados = [i for i, l in enumerate(saida) if slot['container'] in l]
        idx = slot.get('ocorrencia', 0)
        if len(achados) <= idx:
            print(f"// container nao encontrado: {slot['container']!r} "
                  f"(achados={len(achados)})", file=sys.stderr)
            continue

        abre = achados[idx]
        indent = len(saida[abre]) - len(saida[abre].lstrip())
        fecha = next(
            (j for j in range(abre + 1, len(saida))
             if len(saida[j]) - len(saida[j].lstrip()) == indent
             and saida[j].strip().startswith('</')),
            None,
        )
        if fecha is None:
            print(f"// fechamento nao encontrado para {slot['container']!r}", file=sys.stderr)
            continue

        linha = ' ' * (indent + 2) + '{v.' + slot['binding'] + '}'
        if slot.get('modo') == 'append':
            # mantém os filhos do design e acrescenta um ao fim
            saida.insert(fecha, linha)
        else:
            saida[abre + 1:fecha] = [linha]
    return saida


def aplicar_trocas(saida, trocas):
    """
    Substituições literais no JSX gerado.

    Serve para os valores que o design deixou escritos à mão onde deveria
    haver binding — o nome do álbum, por exemplo. Cada troca é conferida:
    se o alvo não existir, avisa em vez de falhar em silêncio.
    """
    for t in trocas:
        alvo, novo = t['de'], t['para']
        # `ocorrencia` escolhe qual das aparições trocar; `primeira: false`
        # troca todas. Sem isso, um termo comum como "Photoon" pegaria a
        # marca do cabeçalho em vez do nome da loja no texto.
        alvo_idx = t.get('ocorrencia')
        vistos, achou = 0, False
        for i, linha in enumerate(saida):
            if alvo not in linha:
                continue
            if alvo_idx is not None and vistos != alvo_idx:
                vistos += 1
                continue
            saida[i] = linha.replace(alvo, novo)
            achou = True
            if alvo_idx is not None or t.get('primeira', True):
                break
        if not achou:
            print(f"// troca nao encontrada: {alvo!r}", file=sys.stderr)
    return saida


def recortar_conteudo(corpo: str, caminho: str) -> str:
    """
    Descarta a moldura da tela e devolve só o conteúdo.

    Cada `.dc.html` do painel do lojista traz sua própria cópia da sidebar e da
    topbar — vinte e duas cópias do mesmo menu, escritas à mão. A moldura de
    verdade é uma só (`ShellLojistaDesign`, gerada de Dashboard.dc.html), e o
    conteúdo de cada tela entra no slot dela.

    O corte é seguro porque a estrutura é idêntica nos vinte e dois arquivos:

        <div flex>  <aside>menu</aside>  <main>  <header>topbar</header>
                                                 ...conteúdo...
                                         </main>  </div>

    Fica o que está entre `</header>` e o `</main>` final. Se o arquivo fugir
    dessa forma, aborta em vez de gerar uma tela truncada em silêncio.
    """
    fim_topbar = corpo.find('</header>')
    fim_main = corpo.rfind('</main>')
    if fim_topbar == -1 or fim_main == -1 or fim_main < fim_topbar:
        raise SystemExit(
            f'{caminho}: nao achei a moldura <header>...</header> ... </main>. '
            'Sem ela o recorte de conteudo nao e confiavel.'
        )
    return equilibrar(corpo[fim_topbar + len('</header>'):fim_main], caminho)


class Contador(HTMLParser):
    """Acha as tags que um fragmento abre e não fecha."""

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.pilha = []

    def handle_starttag(self, tag, attrs):
        if tag not in VAZIAS:
            self.pilha.append(tag)

    def handle_endtag(self, tag):
        if tag in self.pilha:
            while self.pilha and self.pilha.pop() != tag:
                pass


def equilibrar(fragmento: str, caminho: str) -> str:
    """
    Fecha o que o recorte deixou aberto.

    O `<main>` de algumas telas exportadas abre uma `<div>` a mais do que
    fecha — o fechamento sobrou depois de `</main>`, onde o navegador ainda
    equilibrava o documento inteiro. Num recorte isso vira JSX quebrado.
    Fechar aqui reproduz exatamente o aninhamento que o design tinha.
    """
    c = Contador()
    c.feed(fragmento)
    if not c.pilha:
        return fragmento
    print(
        f"// {caminho.split('/')[-1]}: fechando {len(c.pilha)} tag(s) que o "
        f"<main> deixou aberta(s): {', '.join(reversed(c.pilha))}",
        file=sys.stderr,
    )
    return fragmento + ''.join(f'</{t}>' for t in reversed(c.pilha))


def main():
    caminho, componente = sys.argv[1], sys.argv[2]
    cfg = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
    if isinstance(cfg, list):
        cfg = {'slots': cfg}
    slots = cfg.get('slots', [])
    trocas = cfg.get('trocas', [])
    bruto = open(caminho, encoding='utf-8').read()
    corpo = bruto.split('<x-dc>')[1].split('</x-dc>')[0]
    corpo = re.sub(r'<helmet>[\s\S]*?</helmet>', '', corpo)
    if cfg.get('somenteConteudo'):
        corpo = recortar_conteudo(corpo, caminho)

    c = Conversor()
    c.feed(corpo)

    c.saida = aplicar_slots(c.saida, slots)
    c.saida = aplicar_trocas(c.saida, trocas)

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
