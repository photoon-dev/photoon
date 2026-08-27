# Photoon, especificação das telas do usuário criador de álbuns

Documento exclusivo para o nível de cliente final que recebe fotos e projetos liberados por uma empresa, seleciona imagens, cria, edita, revisa e finaliza álbuns.

Não criar neste momento telas de Super Admin, Manager do lojista, CRM, produção, expedição, integrações, relatórios ou configurações administrativas.

## Prompt mestre para o Claude Design

Crie exclusivamente a área do cliente final da Photoon destinada à criação de álbuns fotográficos. O produto deve manter o mesmo design system moderno já utilizado no dashboard administrativo da Photoon, mas o editor deve ser uma experiência focada, tranquila, organizada e fácil para pessoas sem conhecimento de diagramação.

Esta área funciona dentro da loja personalizada da empresa que contratou a Photoon. No concorrente analisado, `photum.auryn.com.br` é a loja da Photum e `auryn.com.br` é a plataforma. Na Photoon, aplicar o mesmo conceito de tenant, por exemplo `empresa.photoon.com.br`, com domínio próprio opcional.

A empresa administradora envia as fotos, cria ou libera os projetos e vincula a galeria ao cliente. O cliente final não faz upload e não pode apagar os arquivos originais. Ele entra na loja da empresa, encontra fotos e projetos já liberados, escolhe as imagens que deseja usar e monta um ou mais álbuns quando essa permissão estiver habilitada.

Não copie o visual antigo apresentado nos prints. Use os prints apenas para compreender as funções existentes: biblioteca de fotos, ampliação ao passar o mouse, fundos, enfeites, texto, espaçamento, páginas, autosave, compartilhamento e finalização.

Redesenhe completamente a experiência. A pessoa deve conseguir montar um álbum com a galeria já liberada de duas formas:

1. Criar automaticamente com inteligência artificial, selecionando as fotos e recebendo um álbum completo em poucos cliques.
2. Criar manualmente, usando layouts inteligentes, fotos, textos, fundos e elementos modernos.

Crie todas as telas e painéis descritos neste documento. Não transforme cada módulo em um dashboard genérico. Cada botão deve ter destino, modal, painel ou mudança de estado definida. Desenhe desktop em 1440 px, tablet em 1024 px e mobile em 390 px para os fluxos de projetos, seleção das fotos liberadas, criação com IA, revisão e ajustes simples. O editor completo deve ser desktop-first, mas precisa permitir no celular trocar fotos, corrigir enquadramento, editar textos, aprovar páginas e finalizar.

## 1. Design system obrigatório

### Identidade visual

- Fonte principal: Plus Jakarta Sans.
- Fundo geral: `#F4F7FC`.
- Superfícies: `#FFFFFF`.
- Texto principal: `#0B1220`.
- Texto secundário: `#46536A`.
- Texto discreto: `#6B7A90`.
- Cor primária: `#2563EB`.
- Cor secundária: `#06B6D4`.
- Gradiente principal: `linear-gradient(135deg, #2563EB, #06B6D4)`.
- Bordas: `#E6EAF2`.
- Sucesso: `#059669`.
- Atenção: `#F59E0B`.
- Erro: `#E11D48`.
- Área externa do canvas: `#E8EDF5`, nunca o cinza pesado do sistema antigo.
- Margens e áreas técnicas: azul claro, âmbar ou vermelho conforme o nível de risco.

### Componentes

- Cards com raio de 14 px.
- Campos com 44 px de altura e raio de 12 px.
- Botão principal com gradiente azul e ciano.
- Botão secundário branco, borda fria e texto grafite.
- Ícones lineares, modernos e consistentes.
- Sombras leves, sem aparência de painel antigo.
- Grid de espaçamento baseado em 8 px.
- Tooltips objetivos em todos os ícones sem texto.
- Foco de teclado sempre visível.
- Não utilizar o verde-limão visto nos prints antigos.

### Linguagem

- Usar palavras simples.
- Trocar “Enfeites” por “Elementos”.
- Trocar “Auto” por “Assistência inteligente”.
- Trocar “Design” por “Layouts”.
- Trocar “Finalizar meu álbum” por “Revisar e finalizar”.
- Explicar erros e indicar como corrigir.
- Nunca mostrar mensagem técnica como primeira resposta ao usuário.

## 2. Contexto da loja, acesso e permissões

### Hierarquia correta

1. **Photoon:** plataforma SaaS e infraestrutura.
2. **Empresa administradora:** estúdio, escola, laboratório ou loja que contrata a Photoon.
3. **Loja personalizada:** ambiente com marca e subdomínio da empresa, por exemplo `empresa.photoon.com.br`.
4. **Cliente final:** pessoa convidada pela empresa para montar e finalizar os álbuns que foram liberados para ela.

### Identidade da loja

- Logo, nome, favicon, canais de contato e textos da empresa aparecem no ambiente do cliente.
- O design estrutural continua sendo Photoon, com os mesmos componentes e padrões do dashboard administrativo.
- A cor principal da empresa pode ser aplicada apenas em pontos controlados, sem quebrar contraste ou consistência.
- Rodapé opcional e discreto com “Tecnologia Photoon”.
- Nenhum cliente pode ver dados, galerias ou projetos de outra empresa.

### Permissões do cliente final

- Visualizar somente galerias vinculadas ao próprio acesso.
- Selecionar fotos já enviadas pela empresa.
- Criar novos álbuns somente se a empresa liberar essa ação e os produtos permitidos.
- Editar, duplicar ou excluir projetos somente conforme a regra definida pela empresa.
- Usar IA, layouts, texto, fundos e elementos nos próprios projetos.
- Compartilhar, revisar e finalizar conforme o fluxo da loja.
- Não enviar fotos para a galeria de origem.
- Não apagar, renomear ou substituir o arquivo original enviado pela empresa.
- Não alterar produto, tamanho, quantidade de páginas, acabamento ou preço quando esses dados estiverem bloqueados pela empresa.

### Origem dos dados exibidos

- `tenant_id`: define a empresa e sua loja.
- `customer_id`: identifica o cliente final.
- `gallery_id`: identifica o conjunto de fotos liberado pela empresa.
- `project_id`: identifica cada álbum do cliente.
- A interface sempre deve carregar o projeto e a galeria no contexto do mesmo tenant.

## 3. Estrutura geral da área do usuário

O cliente final possui somente este menu principal:

- Início.
- Meus projetos.
- Criar álbum, apenas quando autorizado pela empresa.
- Minha conta.
- Ajuda.

Ao entrar no editor, o menu da conta desaparece para liberar espaço. O editor usa um modo focado com botão “Voltar aos projetos”.

## 4. Evidências confirmadas nos prints e decisões de melhoria

### Confirmado no sistema atual

- A empresa possui uma loja em subdomínio próprio da plataforma.
- O cliente entra em uma página identificada pela empresa, não no painel administrativo da plataforma.
- As fotos são enviadas e vinculadas pela empresa administradora.
- Um cliente pode receber mais de um projeto.
- Cada projeto apresenta produto, tamanho, status, edição e visualização.
- O sistema atual exige que os projetos estejam editados antes da ação “Finalizar meus projetos”.
- Ao tentar finalizar com páginas sem foto, o sistema lista as lâminas vazias em um modal bloqueador.
- A tela posterior à finalização ainda não foi documentada e não deve ser inventada nesta versão.

### Manter

- Ampliação da foto ao passar o mouse.
- Informação de salvamento automático.
- Desfazer e refazer.
- Linha de miniaturas das páginas.
- Possibilidade de filtrar fotos não utilizadas.
- Ordenação por data e nome.
- Controle de espaçamento entre fotos.
- Inserção simples de texto.
- Compartilhamento e finalização.

### Corrigir

- A tela inicial não pode ser apenas um vídeo com um botão.
- O usuário precisa entrar diretamente em uma central com seus projetos.
- Menus suspensos não podem cobrir as fotos.
- Fotos precisam de filtros por orientação, pessoas, qualidade, data, favoritas e uso.
- A biblioteca não pode mostrar somente nome de arquivo e miniatura.
- Fundos e elementos precisam de curadoria visual moderna.
- Elementos não podem ser cliparts antigos, corações e molduras sem consistência.
- O botão de finalizar não deve aparecer antes de o álbum ser validado.
- O controle de texto precisa ser simples, mas completo.
- O controle de espaçamento deve ficar no inspetor do layout, não em uma janela perdida sobre o canvas.
- O canvas precisa ocupar o centro real da experiência.
- A IA deve ser uma ação principal visível, não um pequeno botão “Auto”.

# Telas e painéis

## U00. Acesso à loja da empresa

**Rota:** `/entrar` no subdomínio da empresa.

**Objetivo:** permitir que o cliente final acesse somente a loja, as galerias e os projetos que a empresa vinculou ao seu cadastro.

### Estrutura

- Logo e nome da empresa no topo.
- Card central de até 440 px.
- Título “Acesse seus projetos”.
- Campo E-mail ou identificação definida pela empresa.
- Campo Senha com mostrar ou esconder.
- Checkbox “Manter conectado neste dispositivo”.
- Link “Esqueci minha senha”.
- Botão principal “Entrar”.
- Card discreto de suporte “Problemas para acessar? Fale com a empresa”.
- Rodapé com política de privacidade, contato da empresa e “Tecnologia Photoon” opcional.

### Primeiro acesso por convite

- O link enviado pela empresa abre com a identificação já associada.
- Pedir criação de senha e confirmação.
- Exibir nome da empresa e primeiro nome do cliente para confirmar o contexto.
- Não mostrar seleção de tenant ou de loja.
- Após concluir, abrir U01.

### Recuperação de senha

1. Cliente informa o e-mail ou identificador.
2. Sistema sempre mostra resposta neutra para não revelar cadastros.
3. Link válido abre “Criar nova senha”.
4. Após salvar, botão “Voltar para entrar”.

### Estados

- Credenciais inválidas.
- Link expirado.
- Acesso ainda não liberado pela empresa.
- Acesso revogado.
- Muitas tentativas, com espera segura.
- Serviço temporariamente indisponível.

## U01. Início do cliente e central de projetos

**Rota:** `/home` no subdomínio da empresa.

**Objetivo:** ser a primeira tela após o login, mostrar todos os projetos e galerias liberados pela empresa e explicar claramente o que falta para a finalização.

### Estrutura visual

1. Header branco de 72 px com logo da empresa à esquerda.
2. Navegação discreta: Projetos, Ajuda e Minha conta. Adicionar Pedidos somente se a tela posterior à finalização confirmar essa etapa.
3. À direita, botão de ajuda e avatar do cliente.
4. Conteúdo sobre fundo `#F4F7FC`, com largura máxima de 1200 px.
5. Saudação “Olá, Julia” e complemento “Estes são os projetos liberados para você pela Photum”.
6. Resumo de prontidão abaixo da saudação.
7. Barra de busca e filtros.
8. Lista ou grade responsiva de cards de projetos.
9. Rodapé com dados de contato da empresa e “Tecnologia Photoon” opcional.

### Resumo de prontidão

Substituir o alerta amarelo genérico do concorrente por um card informativo com:

- Título “Seus projetos”.
- Contador “1 de 3 projetos prontos para finalizar”.
- Barra de progresso.
- Lista curta do que falta, por exemplo “2 projetos ainda possuem páginas sem foto”.
- Botão principal “Revisar projetos”.
- Link “Entenda como funciona a finalização”.

Se a empresa configurar finalização conjunta, explicar: “Todos os projetos deste pedido precisam estar prontos antes do envio”. Se configurar finalização individual, cada card terá sua própria ação de finalizar. Essa regra vem da empresa e o cliente não pode alterá-la.

### Ação Criar novo álbum

- Mostrar somente quando a empresa permitir novos projetos para aquela galeria.
- Texto do botão “Criar outro álbum”.
- Ao clicar, abrir a tela U03 com produtos, formatos e limites liberados pela empresa.
- Se não estiver permitido, não exibir botão desabilitado nem sugerir compra indisponível.

### Filtros

- Todos.
- Não iniciados.
- Em edição.
- Com pendências.
- Prontos para finalizar.
- Finalizados.
- Produto.
- Tamanho.
- Data de alteração.
- Busca por nome do projeto.
- Ordenação por alterado recentemente, nome e status.

### Card do projeto

- Capa real ou placeholder elegante quando ainda não houver capa.
- Nome do projeto, por exemplo “Fotolivro da formatura”.
- Produto e tamanho, por exemplo “Wood 40x30 Fotográfico”.
- Quantidade de páginas e fotos utilizadas.
- Percentual de conclusão.
- Data e horário do último salvamento.
- Badge de status.
- Resumo de pendências, quando existirem.
- Preço somente se a empresa permitir exibição.
- Botão principal conforme o estado: “Começar”, “Continuar editando”, “Corrigir pendências” ou “Visualizar”.
- Botão secundário “Visualizar” quando o projeto já tiver conteúdo.
- Menu de três pontos somente com ações autorizadas: Renomear, Duplicar, Compartilhar, Arquivar ou Excluir.

### Status obrigatórios

- Não iniciado.
- Em edição.
- Salvando.
- Com pendências.
- Pronto para revisar.
- Pronto para finalizar.
- Finalizado.
- Em processamento, quando a empresa ainda estiver preparando fotos ou projeto.

### Comportamentos

- Ao passar o mouse sobre uma capa pronta, mostrar uma animação curta folheando três páginas.
- Ao clicar no card, abrir o detalhe do projeto U02.
- Ao clicar em Editar ou Continuar, abrir diretamente o editor U08.
- Ao clicar em Visualizar, abrir U18 sem ferramentas de edição.
- Duplicar deve usar somente a galeria já vinculada e respeitar os limites da empresa.
- Excluir deve abrir confirmação apenas quando o cliente tiver permissão.
- “Alterar minha senha” deve ficar em Minha conta, nunca como botão grande no centro da página.

### Estado sem projetos

Não sugerir upload. Mostrar:

- Ícone de galeria aguardando liberação.
- Título “Nenhum projeto foi liberado ainda”.
- Texto “Quando a empresa disponibilizar suas fotos e álbuns, eles aparecerão aqui”.
- Botão “Falar com a empresa”.
- Dados de contato definidos pelo tenant.

## U02. Detalhe do projeto

**Rota:** `/conta/projetos/:projectId`

**Objetivo:** oferecer uma visão simples do álbum liberado pela empresa antes de abrir o editor.

### Estrutura

- Breadcrumb “Meus projetos / Nome do projeto”.
- Capa grande do projeto à esquerda.
- À direita, nome, empresa responsável, galeria vinculada, produto, tamanho, páginas, fotos, status e último salvamento.
- Barra de progresso da criação.
- Botão principal “Continuar editando”.
- Botão “Visualizar álbum”.
- Botão “Compartilhar”.
- Card “Pendências para finalizar”.
- Histórico de versões e atividades na parte inferior.

### Pendências possíveis

- Fotos com baixa resolução.
- Fotos repetidas.
- Rosto muito próximo do corte.
- Espaços vazios.
- Texto fora da área segura.
- Páginas sem conteúdo.
- Projeto ainda sendo gerado pela IA.

### Ações

- Renomear.
- Duplicar.
- Trocar produto, somente quando a empresa permitir.
- Abrir editor.
- Abrir revisão.
- Compartilhar.
- Arquivar.

## U03. Criar novo álbum

**Rota:** `/criar-album`

**Objetivo:** permitir que o cliente crie outro álbum a partir da galeria já liberada, somente quando a empresa autorizar novos projetos.

### Regra de acesso

- A rota só pode abrir se `can_create_project` estiver habilitado para o cliente ou para a galeria.
- Produtos, formatos, acabamentos, quantidade de páginas e preços vêm da configuração da empresa.
- Se o acesso vier de um botão desatualizado ou link direto sem permissão, mostrar “A criação de novos álbuns não está disponível” e um botão “Voltar aos projetos”.

### Layout

- Stepper horizontal no topo.
- Conteúdo central com largura máxima de 1120 px.
- Resumo fixo à direita em desktop.
- Botões Voltar e Continuar fixos no rodapé do wizard.
- Salvamento do progresso em cada etapa.

### Etapa 1, escolha do produto

Cards grandes com fotografia real do produto:

- Álbum encadernado.
- Fotolivro.
- Revista.
- Estojo com álbum.
- Outros produtos liberados pela empresa.

Cada card mostra nome, descrição curta, preço inicial e prazo.

### Etapa 2, formato

- Tamanho.
- Orientação horizontal, vertical ou quadrada.
- Quantidade inicial de páginas.
- Tipo de capa.
- Estojo, quando disponível.
- Revestimento e acabamento essenciais.

Usar amostras visuais, não selects extensos.

### Etapa 3, modo de criação

Mostrar quatro cards:

1. **IA rápida, recomendado.** A Photoon ajuda a selecionar, organiza e diagrama automaticamente as fotos liberadas.
2. **IA guiada.** O usuário escolhe estilo, ordem e densidade antes da criação.
3. **Usar um modelo.** O usuário escolhe um template e preenche manualmente.
4. **Começar em branco.** Abre o editor vazio.

### Etapa 4, nome do projeto

- Nome do álbum.
- Evento ou ocasião opcional.
- Data opcional.
- Botão “Criar projeto”.

Após criar, seguir para U04, onde o cliente escolhe as fotos dentro da galeria vinculada. Nunca abrir dropzone, seletor de arquivos ou câmera.

## U04. Galeria liberada e seleção de fotos

**Rota:** `/criar-album/:projectId/fotos`

**Objetivo:** permitir que o cliente escolha, com rapidez e segurança, fotos que já foram enviadas e vinculadas pela empresa administradora.

### Regra principal

- Não criar upload, dropzone, QR Code, câmera, Google Fotos, Drive ou Dropbox nesta área.
- O cliente não pode apagar, renomear ou substituir arquivos da galeria original.
- Todas as fotos exibidas precisam pertencer à galeria vinculada ao cliente e ao mesmo tenant.
- Se houver mais de uma galeria liberada, a empresa define se o cliente pode combinar galerias no mesmo projeto.

### Cabeçalho

- Voltar aos projetos ou à etapa anterior.
- Nome do projeto.
- Nome da galeria e evento, por exemplo “Formatura 2026, sessão Julia”.
- Contador “42 de 120 fotos selecionadas”.
- Faixa recomendada “Para 20 lâminas, sugerimos entre 50 e 80 fotos”.
- Botão secundário “Ajudar a escolher”.
- Botão principal “Continuar com 42 fotos”.

### Informações da galeria

Card compacto e recolhível com:

- Empresa responsável.
- Data da sessão ou evento, quando disponível.
- Quantidade total de fotos liberadas.
- Data da última atualização.
- Aviso “As fotos foram disponibilizadas pela empresa e não podem ser excluídas aqui”.
- Link “Está faltando alguma foto?” que abre U04A.

### Barra de filtros fixa

- Busca pelo nome do arquivo.
- Todas.
- Selecionadas.
- Não selecionadas.
- Favoritas.
- Verticais.
- Horizontais.
- Quadradas.
- Panorâmicas.
- Uma pessoa.
- Duas pessoas.
- Grupo.
- Sem pessoas.
- Alta qualidade.
- Atenção de qualidade.
- Possíveis duplicadas.
- Data.
- Cenário ou momento, quando houver classificação.

Os filtros mais importantes, Todas, Selecionadas, Verticais, Horizontais e Favoritas, ficam visíveis como chips. Os demais abrem em um drawer lateral. Nunca usar um menu aberto sobre a grade de fotos.

### Ordenação

- Ordem definida pela empresa.
- Data da foto.
- Nome.
- Melhor qualidade.
- Orientação.
- Favoritas primeiro.
- Ordem personalizada da seleção.

### Grade e card de foto

- Grade responsiva com miniaturas em proporção natural.
- Checkbox grande no canto superior esquerdo.
- Ícone de favorita no canto superior direito.
- Badge vertical, horizontal ou panorâmica.
- Indicador de qualidade somente quando houver atenção.
- Indicador discreto de rosto detectado.
- Número da foto ou nome do arquivo apenas em tooltip.
- Seleção por clique, intervalo com `Shift` e seleção múltipla com `Ctrl/Cmd`.
- Barra de ação fixa quando houver seleção múltipla: Selecionar, Desmarcar, Favoritar e Enviar para criação com IA.

### Ampliação ao passar o mouse

Manter a função vista nos prints, porém com melhor comportamento:

- Após 400 ms de hover, abrir um preview de até 420 x 520 px.
- Posicionar o preview do lado que não cobre o cursor nem a maior parte da biblioteca.
- Mostrar nome, dimensão, data, orientação, qualidade e quantidade de rostos.
- Mostrar botões “Selecionar”, “Favoritar” e “Ver em tela cheia”.
- Tecla Espaço fixa e solta o preview.
- Duplo clique abre a visualização em tela cheia.

### Seleção inteligente

Botão “Ajudar a escolher”. Ao clicar, abrir um painel explicando que a Photoon pode:

- Sinalizar fotos desfocadas.
- Sinalizar olhos possivelmente fechados.
- Agrupar fotos semelhantes.
- Sugerir a melhor foto de uma sequência.
- Evitar duplicadas.
- Equilibrar fotos verticais e horizontais.
- Priorizar favoritas.
- Distribuir melhor as pessoas importantes ao longo do álbum.

Mostrar três modos:

1. “Selecionar as melhores automaticamente”.
2. “Sugerir e deixar que eu confirme”.
3. “Manter somente minha seleção manual”.

Mesmo no modo automático, o cliente vê o resultado e pode incluir ou retirar fotos antes de gerar o álbum.

### Estados da galeria

- Carregando miniaturas.
- Galeria disponível.
- Empresa atualizou a galeria, com botão “Ver novas fotos”.
- Algumas miniaturas ainda estão sendo processadas.
- Galeria temporariamente indisponível, com nova tentativa.
- Nenhuma foto liberada, com orientação para falar com a empresa.
- Acesso revogado, sem revelar detalhes administrativos.

## U04A. Solicitar ajuda sobre as fotos

**Tipo:** drawer sobre a galeria.

**Objetivo:** permitir que o cliente informe fotos ausentes ou incorretas sem receber permissão de upload.

### Conteúdo

- Título “Precisa de ajuda com suas fotos?”.
- Categorias: Está faltando uma foto, Há uma foto de outra pessoa, Uma imagem não abre, Quero falar com a empresa.
- Campo de mensagem.
- Campo opcional para informar números ou nomes dos arquivos.
- Botão “Enviar solicitação”.
- Confirmação “Sua mensagem foi enviada para a empresa”.

Este fluxo apenas envia uma solicitação. Não altera a galeria e não cria upload para o cliente.

## U05. Preferências da criação com IA

**Rota:** `/criar-album/:projectId/ia`

**Objetivo:** receber preferências suficientes para criar um álbum bonito sem transformar o processo em um formulário cansativo.

### Alternância de modo

- **Rápido.** Um botão para gerar com as escolhas recomendadas.
- **Guiado.** Quatro grupos de preferências.

### Grupo 1, estilo visual

Cards com preview real:

- Minimalista.
- Editorial.
- Elegante.
- Romântico moderno.
- Vibrante.
- Clássico limpo.

Não usar temas infantis ou cliparts antigos como opções padrão.

### Grupo 2, ritmo das páginas

- Mais clean, 1 ou 2 fotos por lâmina.
- Equilibrado, 2 a 4 fotos por lâmina.
- Mais dinâmico, 3 a 6 fotos por lâmina.

### Grupo 3, organização

- Respeitar ordem cronológica.
- Agrupar por pessoas.
- Agrupar por cenário.
- Misturar de forma equilibrada.
- Começar e terminar com fotos favoritas.

### Grupo 4, cuidados inteligentes

Checkboxes ativados por padrão:

- Evitar cortar rostos.
- Manter espaço seguro ao redor do rosto.
- Evitar repetir fotos semelhantes.
- Priorizar fotos de maior qualidade.
- Harmonizar cores do fundo com as fotografias.
- Não deixar quadros vazios.
- Preservar a orientação natural da foto sempre que possível.

### Campo opcional

“Conte para a IA o que é importante neste álbum”. Exemplo: “Quero destacar a formanda, os pais e a entrega do diploma”.

### Rodapé

- Voltar às fotos.
- Estimativa “A IA criará aproximadamente 20 lâminas”.
- Botão principal “Criar meu álbum”.

## U06. Geração do álbum com IA

**Rota:** `/criar-album/:projectId/gerando`

**Objetivo:** deixar claro que o trabalho está ocorrendo, permitir sair da tela e evitar sensação de travamento.

### Visual

- Preview animado de páginas sendo formadas.
- Progresso em etapas, não uma porcentagem falsa.
- Mensagens curtas e tranquilas.

### Etapas exibidas

1. Analisando qualidade e orientação.
2. Identificando pessoas e áreas seguras.
3. Organizando a história.
4. Escolhendo layouts.
5. Ajustando enquadramentos.
6. Preparando a primeira versão.

### Ações

- “Pode continuar em segundo plano”.
- “Voltar aos projetos”.
- Notificar quando terminar.
- Cancelar, com confirmação.

### Estados

- Em fila.
- Processando.
- Finalizado.
- Falha recuperável.
- Falha em algumas fotos, com opção de continuar sem elas.

## U07. Resultado da IA e escolha de direção

**Rota:** `/criar-album/:projectId/resultado-ia`

**Objetivo:** mostrar o álbum completo sem jogar imediatamente o usuário no editor técnico.

### Estrutura

- Preview grande do álbum no centro.
- Miniaturas das lâminas à esquerda.
- Resumo da IA à direita.
- Botão “Gostei, continuar”.
- Botão “Ajustar preferências”.
- Botão “Gerar outra versão”.

### Resumo da IA

- Fotos utilizadas.
- Fotos não utilizadas.
- Possíveis duplicadas removidas.
- Fotos com alerta de qualidade.
- Páginas criadas.
- Estilo aplicado.

### Ações por lâmina

Ao passar o mouse sobre uma lâmina, mostrar:

- Editar esta lâmina.
- Gerar outra opção somente para esta lâmina.
- Trocar layout.
- Trocar fotos.
- Marcar como aprovada.

### Regra importante

Regenerar uma lâmina não pode modificar o restante do álbum.

## U08. Editor principal do álbum

**Rota:** `/editor/:projectId`

**Objetivo:** oferecer um editor limpo e progressivo. O usuário iniciante vê o essencial. Controles extras aparecem apenas quando um objeto é selecionado.

### Estrutura desktop

1. **Topbar, 64 px.** Ocupa toda a largura.
2. **Barra de ferramentas, 72 px.** Coluna vertical à esquerda.
3. **Painel contextual, 328 px.** Abre ao lado da barra esquerda.
4. **Canvas central.** Usa todo o espaço restante.
5. **Inspetor direito, 288 px.** Aparece somente quando necessário.
6. **Storyboard inferior, 112 px.** Exibe páginas e alertas.

### Topbar

Da esquerda para a direita:

- Botão Voltar aos projetos.
- Logo símbolo Photoon.
- Nome do projeto editável.
- Estado “Salvo agora”, “Salvando” ou “Sem conexão”.
- Desfazer.
- Refazer.
- Zoom.
- Alternar página ou lâmina.
- Preview.
- Ajuda.
- Compartilhar.
- Botão principal “Revisar e finalizar”.

O botão de finalizar somente fica ativo quando não existem erros bloqueadores.

### Barra esquerda

- Fotos.
- Layouts.
- Texto.
- Fundos.
- Elementos.
- IA.

Cada item abre o painel contextual. Apenas um painel fica aberto por vez. O usuário pode recolher o painel e aumentar o canvas.

### Canvas

- Fundo externo `#E8EDF5`.
- Álbum branco centralizado.
- Sombra suave.
- Linha central da dobra.
- Sangria e área segura com legenda.
- Navegação por scroll e setas.
- Zoom centralizado no cursor.
- Pan com barra de espaço.
- Ajuste de visualização: encaixar lâmina, 100%, 150% e personalizado.

### Barra flutuante do objeto

Ao selecionar uma foto, texto ou elemento, mostrar uma barra pequena próxima ao objeto com ações frequentes. As propriedades completas aparecem no inspetor direito.

### Atalhos

- `Ctrl/Cmd + Z`: desfazer.
- `Ctrl/Cmd + Shift + Z`: refazer.
- `Delete`: remover selecionado.
- `Ctrl/Cmd + D`: duplicar.
- `Espaço`: mover canvas.
- `+` e `-`: zoom.
- Setas: mover objeto com precisão.

## U09. Painel Fotos

**Tipo:** painel interno do editor.

### Cabeçalho

- Título “Fotos”.
- Total liberado pela empresa.
- Total utilizado.
- Identificação da galeria vinculada.
- Busca.

### Filtros sempre visíveis em chips

- Todas.
- Não usadas.
- Usadas.
- Favoritas.
- Verticais.
- Horizontais.
- Quadradas.
- Panorâmicas.
- Com pessoas.
- Sem pessoas.
- Qualidade baixa.
- Duplicadas.

Filtros avançados abrem um drawer, não um select sobre as fotos.

### Ordenação

- Data.
- Nome.
- Ordem da empresa.
- Qualidade.
- Uso no álbum.

### Miniatura

- Proporção natural.
- Badge com quantidade de vezes utilizada.
- Ícone de favorita.
- Indicador de qualidade.
- Indicador de rosto próximo da borda.
- Checkbox para seleção múltipla.

### Interações

- Arrastar para um quadro substitui ou insere a foto.
- Clicar seleciona.
- Duplo clique abre preview.
- Hover mantém a ampliação melhorada descrita na tela U04.
- Menu de contexto: Visualizar, Favoritar, Encontrar no álbum, Substituir em todas, Retirar do projeto e Informações.

“Retirar do projeto” apenas desmarca a foto e remove seus usos após confirmação. Nunca exclui o arquivo original da galeria administrada pela empresa.

### Seleção múltipla

Quando várias fotos são selecionadas, mostrar uma barra fixa no rodapé do painel:

- Criar página com selecionadas.
- Marcar favoritas.
- Retirar do projeto.
- Enviar para IA.

## U10. Painel Layouts

**Tipo:** painel interno do editor.

**Objetivo:** substituir a área confusa de “Design” por modelos inteligentes e filtráveis.

### Cabeçalho

- Título “Layouts”.
- Botão “Sugerir para esta lâmina”.
- Busca opcional.

### Filtros

- Quantidade de fotos: 1, 2, 3, 4, 5, 6 ou mais.
- Orientação predominante: vertical, horizontal ou mista.
- Estilo: clean, editorial, assimétrico, destaque e mosaico.
- Com texto.
- Sem texto.
- Favoritos.

### Card do layout

- Miniatura clara.
- Quantidade de fotos.
- Indicação de compatibilidade com a seleção atual.
- Favoritar.
- Preview ao passar o mouse.

### Aplicação

- Um clique aplica o layout à lâmina atual.
- Antes de perder enquadramentos manuais, mostrar confirmação.
- A IA deve recomendar os três layouts mais adequados às orientações e rostos das fotos da lâmina.

### Layout automático

Botão “Organizar esta lâmina”. Abre opções:

- Reorganizar mantendo as fotos.
- Reorganizar e trocar fotos semelhantes.
- Aplicar somente nesta lâmina.
- Aplicar padrão às lâminas ainda não editadas.

## U11. Painel Fundos

**Tipo:** painel interno do editor.

**Objetivo:** substituir as estampas antigas por fundos modernos e coerentes com as fotos.

### Abas

- Sugestões.
- Cores.
- Gradientes.
- Texturas.
- Imagens.
- Meus fundos.

### Sugestões inteligentes

Mostrar automaticamente:

- Cores extraídas da foto principal.
- Tons complementares.
- Fundo claro e fundo escuro recomendados.
- Gradientes suaves coerentes com as fotos.
- Texturas discretas adequadas ao estilo escolhido.

### Filtros

- Claro.
- Escuro.
- Neutro.
- Quente.
- Frio.
- Minimalista.
- Editorial.
- Infantil moderno.
- Casamento.
- Formatura.
- Viagem.

### Regras visuais

- Não mostrar cliparts ou estampas datadas como primeira opção.
- Padrões temáticos devem ser discretos.
- O fundo nunca deve prejudicar a leitura ou competir com os rostos.
- Mostrar contraste do texto quando houver texto sobre o fundo.

### Ações

- Aplicar à página.
- Aplicar à lâmina.
- Aplicar ao álbum inteiro.
- Ajustar intensidade.
- Remover fundo.
- Salvar como favorito.

## U12. Painel Elementos

**Tipo:** painel interno do editor.

**Objetivo:** substituir “Enfeites” por uma biblioteca moderna e útil.

### Categorias principais

- Formas.
- Linhas.
- Molduras.
- Grades.
- Ícones.
- Selos.
- Etiquetas.
- Ilustrações.
- Adesivos modernos.
- Texturas.
- Data e localização.
- Eventos.

### Categorias por ocasião

- Casamento.
- Formatura.
- Aniversário.
- Bebê.
- Família.
- Viagem.
- Corporativo.

### Busca

Campo “Buscar elementos”. Aceitar termos como “linha dourada”, “localização”, “formatura minimalista” e “moldura branca”.

### Curadoria

- Elementos organizados por coleções consistentes.
- Não misturar estilos diferentes na mesma coleção.
- Exibir primeiro elementos modernos e minimalistas.
- Cliparts antigos podem existir somente em uma coleção “Clássicos”, nunca como padrão.

### Inserção

- Arrastar para o canvas.
- Clique simples insere no centro da lâmina.
- Ao inserir, abrir o inspetor com cor, opacidade, tamanho, rotação, posição e ordem de camada.
- Elementos vetoriais podem herdar cores extraídas das fotos.

## U13. Ferramenta de texto

**Tipo:** painel interno e inspetor do editor.

**Objetivo:** manter a edição simples, mas suficiente para títulos, legendas e pequenos textos.

### Inserção rápida

Mostrar quatro botões:

- Adicionar título.
- Adicionar subtítulo.
- Adicionar legenda.
- Adicionar texto.

### Barra flutuante

Ao selecionar um texto, mostrar:

- Fonte.
- Tamanho.
- Negrito.
- Itálico.
- Alinhamento.
- Cor.
- Mais opções.

### Inspetor direito

- Família da fonte.
- Peso.
- Tamanho.
- Cor.
- Alinhamento.
- Espaçamento entre letras.
- Espaçamento entre linhas.
- Caixa alta ou normal.
- Opacidade.
- Fundo do texto.
- Borda.
- Sombra suave.
- Ajustar automaticamente ao quadro.
- Posição e rotação.

### Presets

- Elegante.
- Editorial.
- Minimalista.
- Romântico moderno.
- Infantil moderno.
- Formatura.

### Regras

- Não permitir texto fora da área segura sem aviso.
- Avisar quando a cor não tiver contraste.
- Destacar fonte ausente ou não suportada.
- Permitir edição direta no canvas.
- `Enter` cria nova linha. `Esc` encerra edição.

## U14. Inspetor de foto e enquadramento com rosto

**Tipo:** painel direito do editor.

**Objetivo:** melhorar o corte das fotos e evitar que rostos sejam posicionados em dobras, sangrias ou áreas inseguras.

### Ao selecionar uma foto

Mostrar:

- Substituir foto.
- Recortar.
- Encaixar.
- Preencher.
- Girar.
- Espelhar.
- Ajustar brilho.
- Ajustar contraste.
- Ajustar saturação.
- Preto e branco.
- Opacidade.
- Remover.

### Guia de rosto

- Detectar rosto e ponto principal dos olhos.
- Mostrar uma caixa discreta ao redor do rosto.
- Mostrar área segura em azul.
- Mostrar risco de corte em âmbar.
- Mostrar risco crítico em vermelho.
- Alertar se o rosto estiver na dobra central.
- Botão “Corrigir enquadramento”.
- Botão “Manter como está”.

### Correção inteligente

Ao clicar em “Corrigir enquadramento”, apresentar até três opções:

- Priorizar rosto.
- Mostrar mais do corpo.
- Preservar cenário.

O usuário escolhe uma opção e vê o resultado antes de aplicar.

### Várias pessoas

- Identificar o grupo principal.
- Evitar cortar pessoas nas extremidades.
- Avisar quando não for possível preservar todos dentro do quadro.
- Sugerir trocar o layout por um quadro mais horizontal ou maior.

## U15. Storyboard e gerenciador de páginas

**Tipo:** barra inferior e visualização expandida.

**Objetivo:** substituir as miniaturas pequenas e pouco informativas vistas nos prints.

### Barra inferior

- Capa no primeiro card.
- Lâminas identificadas como 1-2, 3-4, 5-6 e assim por diante.
- Miniatura real do conteúdo.
- Badge de alerta.
- Badge de aprovação.
- Botão para recolher ou expandir.

### Ações

- Arrastar para reordenar.
- Adicionar lâmina.
- Duplicar.
- Excluir.
- Marcar como favorita.
- Bloquear edição.
- Regenerar com IA.
- Copiar estilo.
- Colar estilo.

### Visualização expandida

Botão “Ver todas as páginas” abre um gerenciador em tela cheia:

- Grade de lâminas grandes.
- Seleção múltipla.
- Reordenar várias páginas.
- Filtrar páginas com alerta.
- Filtrar páginas não revisadas.
- Aplicar estilo em massa.
- Comparar ritmo visual do álbum.

### Regras

- Excluir página deve recalcular preço quando aplicável.
- Mostrar quantidade mínima e máxima permitida.
- Não alterar páginas bloqueadas durante regeneração por IA.

## U16. Espaçamento, alinhamento e distribuição

**Tipo:** seção do inspetor direito para layouts.

**Objetivo:** incorporar o controle de espaçamento visto no print de forma previsível.

### Controles

- Espaçamento horizontal em milímetros.
- Espaçamento vertical em milímetros.
- Margem externa.
- Alinhar à esquerda.
- Centralizar horizontalmente.
- Alinhar à direita.
- Alinhar ao topo.
- Centralizar verticalmente.
- Alinhar à base.
- Distribuir horizontalmente.
- Distribuir verticalmente.

### Escopo

- Seleção atual.
- Lâmina atual.
- Páginas selecionadas.
- Álbum inteiro.

### Comportamento

- Alteração deve aparecer ao vivo no canvas.
- Exibir valor numérico e slider.
- Permitir digitação precisa.
- Botão “Restaurar recomendado”.
- Informar quando o controle vale somente para layouts automáticos.
- Nunca abrir um modal solto sobre a parte superior do álbum.

## U17. Assistente IA dentro do editor

**Tipo:** painel interno do editor.

**Objetivo:** permitir melhorias rápidas sem regenerar o álbum inteiro.

### Ações rápidas

- Melhorar esta lâmina.
- Criar outra opção.
- Trocar somente o layout.
- Trocar fotos semelhantes.
- Corrigir cortes de rosto.
- Equilibrar espaços.
- Harmonizar fundos.
- Sugerir título.
- Revisar álbum inteiro.

### Campo de instrução

Campo simples “O que você quer mudar?”. Exemplos:

- “Deixe esta página mais clean”.
- “Destaque a foto da família”.
- “Use menos fotos nesta lâmina”.
- “Não corte o rosto”.

### Preview antes de aplicar

- Mostrar antes e depois.
- Aplicar.
- Descartar.
- Gerar outra sugestão.
- Desfazer permanece disponível após aplicar.

### Proteções

- IA não altera páginas bloqueadas.
- IA não substitui favoritas sem confirmação.
- IA não modifica rostos nem inventa pessoas.
- IA não muda todo o álbum quando a ação foi feita em uma lâmina.

## U18. Pré-visualização do álbum

**Rota:** `/editor/:projectId/preview`

**Objetivo:** permitir que o usuário veja o resultado sem ferramentas de edição.

### Modos

- Preview 2D.
- Preview 3D.
- Capa.
- Tela cheia.
- Mobile.

### Controles

- Folhear.
- Ir para uma lâmina.
- Zoom.
- Fundo claro ou escuro.
- Mostrar ou esconder linhas técnicas.
- Comparar com a versão anterior.
- Voltar ao editor.

### Preview de capa

- Frente.
- Dorso.
- Verso.
- Revestimento quando configurado.
- Gravação quando configurada.

## U19. Revisão inteligente

**Rota:** `/editor/:projectId/revisao`

**Objetivo:** impedir que o usuário finalize um álbum com erros simples.

### Cabeçalho

- Título “Revise seu álbum”.
- Progresso de correções.
- Botão Voltar ao editor.
- Botão Finalizar, inicialmente desabilitado se houver erros.

### Categorias

- Erros obrigatórios.
- Recomendações.
- Páginas aprovadas.

### Verificações

- Foto com baixa resolução.
- Rosto cortado.
- Rosto na dobra.
- Foto repetida.
- Quadro vazio.
- Página vazia.
- Texto fora da área segura.
- Texto sem contraste.
- Elemento fora da página.
- Foto não utilizada, apenas como informação.
- Página diferente do padrão visual, apenas como sugestão.

### Card do problema

- Miniatura da lâmina.
- Nome do problema.
- Explicação simples.
- Botão “Corrigir automaticamente”.
- Botão “Abrir no editor”.
- Botão “Ignorar”, somente para recomendação.

### Final da revisão

Quando tudo estiver resolvido, mostrar uma confirmação visual “Seu álbum está pronto para finalizar”.

## U19A. Correção de lâminas sem fotos

**Tipo:** estado bloqueador aberto a partir de U19 ou ao clicar em “Revisar e finalizar”.

**Objetivo:** substituir o modal atual “Parece que você esqueceu de adicionar imagens em algumas páginas” por uma correção clara, visual e acionável.

### Gatilho

- Abrir quando existir ao menos uma página ou quadro obrigatório sem foto.
- Não abrir um modal genérico somente com botão “Entendi”.
- Manter o projeto salvo antes de iniciar qualquer correção automática.

### Layout

- Modal largo de até 920 px no desktop ou tela cheia no mobile.
- Título “Encontramos páginas sem fotos”.
- Resumo “8 lâminas precisam de atenção antes da finalização”.
- Explicação curta “Você pode preenchê-las automaticamente, revisar uma por uma ou excluir as páginas permitidas”.
- Lista rolável à esquerda e miniatura grande da lâmina selecionada à direita.
- Rodapé fixo com ações.

### Item da lista

- Miniatura da lâmina.
- Identificação “Lâmina 3, páginas 5 e 6”.
- Quantidade de quadros vazios.
- Motivo: página vazia ou layout com espaço sem foto.
- Botão “Abrir esta lâmina”.
- Checkbox para correção em lote.

### Ações principais

- **Preencher selecionadas com IA:** usa somente fotos liberadas e ainda não utilizadas, preserva páginas bloqueadas e mostra preview antes de aplicar.
- **Revisar uma por uma:** fecha o modal, abre a primeira lâmina com problema e mostra uma fila de correção no editor.
- **Excluir lâminas vazias:** aparece somente se a empresa permitir, se a quantidade mínima de páginas continuar válida e se não alterar um produto bloqueado.
- **Voltar ao editor:** fecha sem finalizar e mantém os problemas sinalizados no storyboard.

### Preenchimento com IA

1. Mostrar quantas fotos não utilizadas estão disponíveis.
2. Se houver fotos suficientes, gerar layouts adequados à orientação e aos rostos.
3. Exibir antes e depois por lâmina.
4. Permitir Aplicar todas, Aplicar somente esta ou Descartar.
5. Após aplicar, rodar novamente as verificações de quadro vazio, resolução e rosto na dobra.

### Falta de fotos suficientes

- Informar “Não há fotos não utilizadas suficientes para preencher todas as páginas”.
- Oferecer Reutilizar fotos, Reduzir quantidade de páginas quando permitido ou Falar com a empresa.
- Reutilizar fotos deve ser uma escolha explícita, nunca automática.

### Regras de bloqueio

- Página ou quadro vazio é erro bloqueador quando o layout exige conteúdo.
- Recomendações de estilo podem ser ignoradas, páginas vazias não.
- O botão de finalizar só é reativado após nova validação sem erros bloqueadores.

## U20. Compartilhamento e aprovação

**Rota:** `/conta/projetos/:projectId/compartilhar`

**Objetivo:** permitir que outra pessoa visualize o álbum antes da finalização.

### Estrutura

- Preview do álbum.
- Criar link.
- Copiar link.
- Enviar por WhatsApp.
- Enviar por e-mail.
- QR Code.

### Opções

- Data de expiração.
- Senha opcional.
- Permitir comentários.
- Permitir aprovação.
- Mostrar ou esconder preço.
- Marca d'água.

### Comentários

- Comentário associado à lâmina.
- Responder.
- Marcar resolvido.
- Abrir a lâmina no editor.
- Publicar nova versão sem perder o histórico anterior.

## U21. Central de finalização dos projetos

**Rota:** `/finalizar-projetos`

**Objetivo:** modernizar a ação “Finalizar meus projetos” confirmada no print e deixar claro se a empresa exige finalização conjunta ou permite finalizar cada álbum separadamente.

### Entrada

- O botão “Revisar projetos” da U01 abre esta tela.
- Se existir apenas um projeto, manter a mesma estrutura com um único card.
- Se a empresa permitir finalização individual, cada card também pode abrir esta tela filtrada no projeto escolhido.

### Cabeçalho

- Voltar para Meus projetos.
- Título “Revise seus projetos”.
- Subtítulo dinâmico conforme a regra da empresa.
- Resumo “2 de 3 projetos estão prontos”.
- Barra de progresso geral.

### Lista de projetos

Cada card apresenta:

- Capa ou miniatura real.
- Nome do projeto.
- Produto, tamanho e quantidade de páginas.
- Fotos utilizadas.
- Último salvamento.
- Badge Não iniciado, Em edição, Com pendências ou Pronto.
- Lista de até três pendências e link “Ver todas”.
- Botão “Editar” quando houver pendência.
- Botão “Visualizar” quando houver conteúdo.
- Check verde e texto “Pronto para finalizar” quando validado.

### Regra de finalização conjunta

- O botão principal mostra “Finalizar todos os projetos”.
- Fica desabilitado até todos os projetos obrigatórios estarem prontos.
- Ao passar o mouse ou receber foco quando desabilitado, explicar exatamente o que falta.
- Projetos opcionais podem ser retirados do conjunto somente se a empresa permitir.

### Regra de finalização individual

- Cada projeto pronto apresenta “Finalizar este projeto”.
- O botão geral pode mostrar “Finalizar 2 projetos prontos”.
- Projetos com pendência continuam editáveis e não são enviados.

### Confirmações antes da ação final

- Checkbox “Revisei nomes, datas e textos”.
- Checkbox “Estou de acordo com os avisos de qualidade que decidi manter”, somente quando houver recomendações ignoradas.
- Texto da consequência definido pela empresa, por exemplo “Após finalizar, estes projetos não poderão mais ser editados”.
- Checkbox de ciência somente se houver bloqueio de edição posterior.

### Modal de confirmação

- Título “Finalizar estes projetos?”.
- Lista exata dos projetos incluídos.
- Informar o que acontecerá com a edição.
- Botão secundário “Voltar e revisar”.
- Botão principal “Confirmar finalização”.
- Durante o envio, bloquear clique repetido e mostrar progresso real.

### Falha parcial

- Nunca exibir sucesso geral se apenas parte dos projetos foi finalizada.
- Mostrar quais foram concluídos, quais falharam e o botão “Tentar novamente”.
- Não duplicar projetos já enviados ao repetir a operação.

## U22. Estado imediatamente posterior à finalização

**Status desta especificação:** aguardando o print do sistema atual.

Não desenhar nem assumir nesta versão se a próxima etapa é carrinho, pedido, aprovação, pagamento ou confirmação de produção. Assim que a tela for fornecida, documentar:

- rota;
- mensagem de sucesso;
- status aplicado aos projetos;
- possibilidade de editar novamente;
- destino principal;
- dados de pedido ou pagamento;
- comportamento em falha;
- ações disponíveis ao cliente.

## U23. Minha conta

**Rota:** `/minha-conta`

**Objetivo:** retirar “Alterar minha senha” do centro da página de projetos e concentrar dados pessoais e segurança em um local previsível.

### Cabeçalho

- Voltar aos projetos.
- Título “Minha conta”.
- Identificação da empresa responsável pelo acesso.

### Aba Dados pessoais

- Nome.
- E-mail ou identificador de acesso.
- Telefone, se a empresa utilizar esse dado.
- Campos controlados pela empresa aparecem como somente leitura com o texto “Para alterar este dado, fale com a empresa”.
- Botão “Salvar alterações” habilitado somente quando existir mudança permitida.

### Aba Segurança

- Senha atual.
- Nova senha.
- Confirmar nova senha.
- Medidor simples de segurança.
- Botão “Alterar senha”.
- Após sucesso, manter a sessão atual e invalidar outras sessões somente se o cliente escolher essa opção.

### Aba Privacidade

- Link para política de privacidade da empresa.
- Link para termos aplicáveis.
- Solicitar informações ou exclusão de conta, quando disponibilizado pela empresa.
- Explicar que projetos em produção ou registros obrigatórios podem seguir regras de retenção.

### Estados

- Dados salvos.
- Senha atual incorreta.
- Nova senha não atende aos requisitos.
- Sessão expirada, pedindo autenticação novamente.

## U24. Ajuda e contato da empresa

**Rota:** `/ajuda`

**Objetivo:** orientar o cliente sem expor configurações ou suporte interno da Photoon.

### Estrutura

- Busca “Como podemos ajudar?”.
- Atalhos: Começar meu álbum, Escolher fotos, Criar com IA, Editar páginas, Corrigir avisos e Finalizar projetos.
- Tutoriais curtos com texto, imagem e vídeo opcional da empresa.
- FAQ em acordeões.
- Card “Falar com a empresa” com WhatsApp, e-mail ou formulário conforme o tenant.
- Botão “Abrir tour do editor” que retorna ao editor com dicas contextuais.

### Ajuda contextual no editor

- Ícone de interrogação abre um painel, não outra aba.
- O conteúdo muda conforme a ferramenta atual.
- Cada dica deve oferecer “Mostrar na tela”.
- O usuário pode reiniciar ou encerrar o tour a qualquer momento.

# Mapa de navegação e destino das ações

| Origem | Ação | Destino ou resultado |
|---|---|---|
| U00 | Entrar | U01 com dados do tenant e cliente autenticado |
| U01 | Começar ou Continuar editando | U08 no projeto escolhido |
| U01 | Visualizar | U18 em modo somente leitura |
| U01 | Criar outro álbum | U03, somente com permissão |
| U01 | Revisar projetos | U21 |
| U02 | Escolher fotos | U04 com a galeria vinculada |
| U03 | Criar projeto | U04 sem opção de upload |
| U04 | Continuar | U05 para IA ou U08 para montagem manual |
| U04 | Está faltando alguma foto? | U04A |
| U05 | Criar meu álbum | U06 |
| U06 | Geração concluída | U07 |
| U07 | Gostei, continuar | U08 |
| U08 | Preview | U18 |
| U08 | Revisar e finalizar | U19 |
| U19 | Problema em uma lâmina | U08 focado na lâmina |
| U19 | Páginas sem fotos | U19A |
| U19 | Projeto validado | U21 |
| U20 | Abrir comentário | U08 focado na lâmina comentada |
| U21 | Confirmar finalização | U22, ainda não especificada sem o print |
| U23 | Voltar aos projetos | U01 |
| U24 | Mostrar dica na tela | U08 com tour contextual |

# Comportamento responsivo

## Desktop

- Editor completo com painéis esquerdo e direito.
- Storyboard inferior.
- Drag and drop.
- Atalhos de teclado.

## Tablet

- Barra esquerda permanece.
- Painel contextual abre como drawer de 360 px.
- Inspetor direito abre sobre o canvas.
- Storyboard pode ser recolhido.

## Mobile

No celular, priorizar:

- Meus projetos.
- Criar projeto, quando autorizado.
- Seleção de fotos já liberadas pela empresa.
- Criação com IA.
- Review da versão gerada.
- Trocar foto.
- Ajustar enquadramento.
- Editar texto.
- Aprovar páginas.
- Compartilhar.
- Revisar e finalizar.

Não tentar reproduzir o editor desktop inteiro comprimido. No mobile, cada ferramenta abre em tela cheia e o canvas mostra uma página por vez.

# Estados obrigatórios

Criar para cada tela relevante:

- Loading com skeleton.
- Estado vazio orientado.
- Galeria sendo processada pela empresa.
- Galeria atualizada com novas fotos.
- Salvando.
- Salvo.
- Sem conexão.
- Erro recuperável.
- Erro bloqueador.
- Aviso de qualidade.
- Sucesso.
- Sem permissão.
- Ação não liberada pela empresa.

# Componentes que devem ser criados no design system

- ProjectCard.
- ProjectReadinessSummary.
- ProjectStatusBadge.
- AlbumProductCard.
- CreationModeCard.
- PhotoCard.
- PhotoQuickPreview.
- PhotoFilterBar.
- PreloadedGalleryHeader.
- GalleryProcessingState.
- PhotoHelpRequestDrawer.
- SmartSelectionPanel.
- AIStyleCard.
- AIGenerationProgress.
- EditorTopbar.
- EditorToolRail.
- ContextPanel.
- ObjectInspector.
- AlbumCanvas.
- FaceSafeAreaOverlay.
- QualityWarning.
- LayoutCard.
- BackgroundCard.
- ElementCard.
- TextPresetCard.
- PageThumbnail.
- Storyboard.
- ReviewIssueCard.
- EmptySpreadIssueCard.
- EmptySpreadCorrectionModal.
- ShareLinkCard.
- MultiProjectFinalizationSummary.
- FinalizationProjectCard.

# Ordem recomendada para o Claude Design

## Lote 0

- U00 Acesso à loja.
- U23 Minha conta.
- U24 Ajuda.

## Lote 1

- U01 Meus projetos.
- U02 Detalhe do projeto.
- U03 Criar novo álbum.
- U04 Galeria liberada e seleção.
- U04A Solicitar ajuda sobre fotos.

## Lote 2

- U05 Preferências IA.
- U06 Geração.
- U07 Resultado da IA.

## Lote 3

- U08 Editor principal.
- U09 Fotos.
- U10 Layouts.
- U11 Fundos.
- U12 Elementos.
- U13 Texto.

## Lote 4

- U14 Rosto e enquadramento.
- U15 Páginas.
- U16 Espaçamento.
- U17 Assistente IA.

## Lote 5

- U18 Preview.
- U19 Revisão.
- U19A Correção de lâminas sem fotos.
- U20 Compartilhamento.
- U21 Central de finalização.

## Lote pendente de evidência

- U22 Estado posterior à finalização, criar somente após receber o print.

# Critérios finais de aceite

- O usuário entende como começar em menos de 10 segundos.
- O usuário entende que as fotos foram liberadas pela empresa e não precisa procurar uma forma de enviá-las.
- É possível criar mais de um álbum e continuar depois, somente quando a empresa permitir.
- Criar com IA é a opção principal, mas não obriga o usuário.
- A IA consegue gerar o álbum completo a partir das fotos liberadas e selecionadas.
- O usuário pode regenerar somente uma lâmina.
- Fotos possuem filtros verticais, horizontais, usadas, não usadas, pessoas, qualidade e duplicidade.
- A ampliação por hover é preservada e melhorada.
- Rostos possuem área segura e correção guiada.
- Fundos e elementos possuem visual contemporâneo.
- Texto é simples de inserir e editar.
- O canvas não é coberto por menus sem necessidade.
- O usuário sempre sabe se o projeto foi salvo.
- A finalização acontece somente depois da revisão e respeita a regra conjunta ou individual definida pela empresa.
- Páginas vazias abrem uma correção visual com IA, revisão individual e exclusão quando permitida.
- O cliente nunca consegue ver galerias, projetos ou identidade de outra empresa.
- O visual permanece coerente com o dashboard Photoon já criado.

# O que não criar

- Não criar telas administrativas.
- Não criar CRM.
- Não criar produção ou renderizador do lojista.
- Não criar configurações de produto ou preço.
- Não criar relatórios.
- Não criar upload de fotos para o cliente final.
- Não permitir exclusão ou alteração da galeria original pelo cliente.
- Não usar o verde do sistema antigo.
- Não usar cliparts antigos como padrão.
- Não colocar todos os controles no topo.
- Não esconder IA em um toggle pequeno.
- Não criar uma tela genérica para representar todos os painéis.
- Não inventar a tela posterior à finalização antes de receber o print.
