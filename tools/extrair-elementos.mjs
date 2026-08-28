/**
 * Monta a biblioteca de elementos a partir do @iconify/json.
 *
 * Por que assim, e não raspando o acervo de um concorrente: aqui cada peça vem
 * com a licença declarada na origem (Apache 2.0 e MIT, que permitem uso
 * comercial), a procedência é auditável e o acervo é muito maior. Raspar o
 * bucket de outra empresa daria PNGs soltos sem nada disso.
 *
 * O pacote tem ~120 MB e fica FORA do Git: roda na build, como os modelos de
 * rosto. Saída: public/elementos/biblioteca.json
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pacote = join(raiz, 'node_modules', '@iconify', 'json');
const saida = join(raiz, 'public', 'elementos');

if (!existsSync(pacote)) {
  console.warn('[elementos] @iconify/json ausente; biblioteca nao regenerada');
  process.exit(0);
}

// Coleções coloridas, no estilo clipart que o álbum pede. As duas permitem uso
// comercial: Noto é Apache 2.0 e Fluent Emoji é MIT.
const COLECOES = [
  { prefixo: 'noto', licenca: 'Apache 2.0', fonte: 'Google Noto Emoji' },
  { prefixo: 'fluent-emoji-flat', licenca: 'MIT', fonte: 'Microsoft Fluent Emoji' },
  { prefixo: 'fxemoji', licenca: 'Apache 2.0', fonte: 'Firefox OS Emoji' },
  { prefixo: 'fluent-color', licenca: 'MIT', fonte: 'Fluent UI Color' },
];

/**
 * Categorias do produto, com os termos que as alimentam.
 *
 * Os termos são em inglês porque é como os ícones vêm nomeados na origem; o
 * rótulo que o cliente vê é em português.
 */
const CATEGORIAS = [
  { id: 'casamento', rotulo: 'Casamento', termos: ['ring','wedding','bride','kiss','couple','church','bouquet','love-letter','dove','tuxedo','veil','heart-decoration','bell','confetti','champagne','clinking','rose','anniversary'] },
  { id: 'romance',   rotulo: 'Romance',   termos: ['heart','love','rose','cupid','sparkling','revolving','kiss','couple','lips','letter','arrow'] },
  { id: 'bebes',     rotulo: 'Bebês',     termos: ['baby','teddy','nursing','pacifier','stork','rattle','child','bear','duck','balloon','star','moon','cradle','bottle','milk','toy','block'] },
  { id: 'festa',     rotulo: 'Festa',     termos: ['balloon','party','confetti','firework','sparkler','cake','bottle','clinking','popper','tada','music','disco','glass','cocktail','candle','gift','crown','star'] },
  { id: 'natal',     rotulo: 'Natal',     termos: ['christmas','santa','snow','bell','gift','star','candle','reindeer','tree','holly','sock','sleigh','wreath','angel','snowman','winter'] },
  { id: 'viagem',    rotulo: 'Viagem',    exclui: ['hand', 'hands', 'raised', 'tree1', 'reader'],    termos: ['palm','beach','airplane','suitcase','map','island','sun','camera','compass','mountain','ship','car','globe','ticket','passport','umbrella','wave','shell','sunglasses','hotel'] },
  { id: 'formatura', rotulo: 'Formatura', exclui: ['open-book-cover', 'notebook-with-decorative'], termos: ['graduation','diploma','book','school','trophy','medal','pencil','scroll','cap','award','ribbon','certificate','backpack','ruler','pen','star'] },
  { id: 'animais',   rotulo: 'Animais',   termos: ['dog','cat','bird','horse','butterfly','rabbit','fish','paw','bear','fox','lion','elephant','turtle','bee','owl','penguin','whale','deer','duck','panda'] },
  { id: 'comida',    rotulo: 'Comida',    termos: ['cake','pizza','coffee','wine','champagne','cocktail','cookie','ice-cream','cupcake','bread','fruit','strawberry','cherry','donut','candy','chocolate','tea','juice','burger','sushi','honey','cheese','apple'] },
  { id: 'natureza',  rotulo: 'Natureza',  exclui: ['hand', 'engine', 'truck', 'extinguisher', 'station'],  termos: ['flower','leaf','tree','cloud','rainbow','sun','moon','star','blossom','tulip','sunflower','herb','maple','fire','water','snow','wind','mountain','sparkles'] },
  { id: 'esporte',   rotulo: 'Esporte',   exclui: ['crystal', 'eight', 'disco', 'ball-of-yarn'],   termos: ['soccer','ball','trophy','medal','bicycle','running','swim','tennis','basketball','volleyball','surf','ski','yoga','dance','skate','goal','flag'] },
];

/**
 * Nomes em português, próprios da Photoon.
 *
 * Os ícones vêm nomeados em inglês na origem ("palm-tree", "wedding-ring").
 * Guardar esse nome vazaria a procedência para dentro do produto e deixaria o
 * cliente lendo inglês. O id também é nosso (`ph-categoria-000`), o que
 * desliga o acervo do esquema de nomes de terceiros — se um dia trocarmos a
 * fonte, os álbuns já montados continuam válidos.
 */
const PT = {
  ring: 'aliança', wedding: 'casamento', bride: 'noiva', kiss: 'beijo', couple: 'casal',
  church: 'igreja', bouquet: 'buquê', dove: 'pomba', tuxedo: 'terno', veil: 'véu',
  heart: 'coração', love: 'amor', rose: 'rosa', cupid: 'cupido', lips: 'lábios',
  letter: 'carta', arrow: 'flecha', anniversary: 'aniversário',
  baby: 'bebê', teddy: 'ursinho', pacifier: 'chupeta', stork: 'cegonha', rattle: 'chocalho',
  child: 'criança', bear: 'urso', duck: 'patinho', cradle: 'berço', milk: 'leite',
  toy: 'brinquedo', block: 'bloco', bottle: 'garrafa', nursing: 'mamadeira',
  balloon: 'balão', party: 'festa', confetti: 'confete', firework: 'fogos',
  sparkler: 'estrelinha', cake: 'bolo', clinking: 'brinde', popper: 'estala-tampa',
  music: 'música', disco: 'baile', glass: 'taça', cocktail: 'coquetel',
  candle: 'vela', gift: 'presente', crown: 'coroa', star: 'estrela',
  christmas: 'natal', santa: 'papai noel', snow: 'neve', bell: 'sino',
  reindeer: 'rena', tree: 'árvore', holly: 'azevinho', sock: 'meia',
  sleigh: 'trenó', wreath: 'guirlanda', angel: 'anjo', snowman: 'boneco de neve',
  winter: 'inverno',
  palm: 'coqueiro', beach: 'praia', airplane: 'avião', suitcase: 'mala', map: 'mapa',
  island: 'ilha', sun: 'sol', camera: 'câmera', compass: 'bússola',
  mountain: 'montanha', ship: 'navio', car: 'carro', globe: 'globo',
  ticket: 'passagem', passport: 'passaporte', umbrella: 'guarda-sol',
  wave: 'onda', shell: 'concha', sunglasses: 'óculos', hotel: 'hotel',
  graduation: 'formatura', diploma: 'diploma', book: 'livro', school: 'escola',
  trophy: 'troféu', medal: 'medalha', pencil: 'lápis', scroll: 'pergaminho',
  cap: 'capelo', award: 'prêmio', ribbon: 'fita', certificate: 'certificado',
  backpack: 'mochila', ruler: 'régua', pen: 'caneta',
  dog: 'cachorro', cat: 'gato', bird: 'passarinho', horse: 'cavalo',
  butterfly: 'borboleta', rabbit: 'coelho', fish: 'peixe', paw: 'patinha',
  fox: 'raposa', lion: 'leão', elephant: 'elefante', turtle: 'tartaruga',
  bee: 'abelha', owl: 'coruja', penguin: 'pinguim', whale: 'baleia',
  deer: 'veado', panda: 'panda',
  pizza: 'pizza', coffee: 'café', wine: 'vinho', champagne: 'champanhe',
  cookie: 'biscoito', cupcake: 'cupcake', bread: 'pão', fruit: 'fruta',
  strawberry: 'morango', cherry: 'cereja', donut: 'rosquinha', candy: 'bala',
  chocolate: 'chocolate', tea: 'chá', juice: 'suco', burger: 'hambúrguer',
  sushi: 'sushi', honey: 'mel', cheese: 'queijo', apple: 'maçã',
  flower: 'flor', leaf: 'folha', cloud: 'nuvem', rainbow: 'arco-íris',
  moon: 'lua', blossom: 'flor de cerejeira', tulip: 'tulipa',
  sunflower: 'girassol', herb: 'erva', maple: 'bordo', fire: 'fogo',
  water: 'água', wind: 'vento', sparkles: 'brilhos',
  soccer: 'futebol', ball: 'bola', bicycle: 'bicicleta', running: 'corrida',
  swim: 'natação', tennis: 'tênis', basketball: 'basquete',
  volleyball: 'vôlei', surf: 'surf', ski: 'esqui', yoga: 'ioga',
  dance: 'dança', skate: 'skate', goal: 'gol', flag: 'bandeira',
  'ice-cream': 'sorvete',
};

/** Palavras do nome de origem, para casar por palavra inteira. */
const palavras = (nome) => nome.split(/[-_ ]+/).filter(Boolean);

/** Traduz o nome de origem, palavra a palavra, e capitaliza. */
function nomeProprio(bruto) {
  const partes = bruto.split(/[-_ ]+/).filter(Boolean);
  const traduzidas = [];
  for (const p of partes) {
    const t = PT[p];
    // Palavra sem tradução é descartada: "noto:flat-palm-tree-3" vira
    // "Coqueiro", não "Flat coqueiro árvore 3".
    if (t && !traduzidas.includes(t)) traduzidas.push(t);
  }
  if (!traduzidas.length) return '';
  const nome = traduzidas.join(' ');
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

/** Teto por categoria: acervo grande demais vira rolagem infinita, não escolha. */
const TETO = 160;

const biblioteca = { geradoEm: new Date().toISOString(), fontes: [], categorias: [] };

const colecoes = COLECOES.map((c) => {
  const arq = join(pacote, 'json', `${c.prefixo}.json`);
  if (!existsSync(arq)) return null;
  return { ...c, dados: JSON.parse(readFileSync(arq, 'utf8')) };
}).filter(Boolean);

biblioteca.fontes = colecoes.map((c) => ({ nome: c.fonte, licenca: c.licenca }));

for (const cat of CATEGORIAS) {
  const achados = [];
  const vistos = new Set();

  for (const col of colecoes) {
    const { dados } = col;
    const w = dados.width ?? 24;
    const h = dados.height ?? 24;

    for (const termo of cat.termos) {
      for (const [nome, icone] of Object.entries(dados.icons)) {
        if (achados.length >= TETO) break;
        // Casamento por PALAVRA, não por pedaço: com `includes`, "palm" casava
        // dentro de "facepalming" e a categoria Viagem vinha cheia de gente
        // batendo na testa.
        if (!palavras(nome).includes(termo)) continue;
        // As variantes de tom de pele multiplicam o mesmo desenho por seis e
        // enchem a grade sem oferecer escolha nenhuma.
        if (/skin-tone/.test(nome)) continue;
        // Casar por palavra ainda deixa passar homônimo: "palm" é palavra em
        // "palm-down-hand", e duas mãozinhas amarelas apareciam em Viagem.
        if (cat.exclui?.some((x) => palavras(nome).includes(x))) continue;
        const chave = `${col.prefixo}:${nome}`;
        if (vistos.has(chave)) continue;
        vistos.add(chave);
        achados.push({
          // Id da Photoon, estável e sem vínculo com o esquema da origem.
          id: `ph-${cat.id}-${String(achados.length).padStart(3, '0')}`,
          // Sem tradução para nenhuma palavra, vale o termo que trouxe a peça:
          // melhor "Coqueiro" que o nome cru em inglês.
          nome: nomeProprio(nome) || nomeProprio(termo),
          corpo: icone.body,
          w: icone.width ?? w,
          h: icone.height ?? h,
        });
      }
    }
  }

  biblioteca.categorias.push({ id: cat.id, rotulo: cat.rotulo, itens: achados });
  console.log(`  ${cat.rotulo.padEnd(12)} ${String(achados.length).padStart(4)} peças`);
}

mkdirSync(saida, { recursive: true });

// Um arquivo por categoria: o acervo inteiro passa de 8 MB, e o cliente só
// precisa da categoria que abriu. O índice é pequeno e carrega junto com a tela.
let bytes = 0;
for (const cat of biblioteca.categorias) {
  const arq = join(saida, `${cat.id}.json`);
  writeFileSync(arq, JSON.stringify(cat));
  bytes += readFileSync(arq).length;
}

writeFileSync(
  join(saida, 'indice.json'),
  JSON.stringify({
    geradoEm: biblioteca.geradoEm,
    fontes: biblioteca.fontes,
    categorias: biblioteca.categorias.map((c) => ({ id: c.id, rotulo: c.rotulo, total: c.itens.length })),
  }),
);

const mb = (bytes / 1024 / 1024).toFixed(2);
const total = biblioteca.categorias.reduce((s, c) => s + c.itens.length, 0);
console.log(`\n[elementos] ${total} peças em ${biblioteca.categorias.length} arquivos · ${mb} MB`);
console.log(`[elementos] fontes: ${biblioteca.fontes.map((f) => `${f.nome} (${f.licenca})`).join(', ')}`);

// Este script NÃO roda na build. O acervo é versionado, porque é conteúdo do
// produto: pequeno (3,6 MB), determinístico e raramente alterado. Carregar os
// 120 MB do @iconify/json em toda build de contêiner para gerar sempre o mesmo
// resultado seria desperdício — e, quando a dependência faltava, o extrator
// degradava em silêncio e o painel ficava vazio sem ninguém notar.
//
// Para regenerar:  npm i --no-save @iconify/json && node tools/extrair-elementos.mjs
