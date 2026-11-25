# EcoData Arena — critérios de desempenho a cada atualização

**Regra permanente do projeto:** em toda alteração funcional ou visual, revisar desempenho e executar regressões antes de publicar. Não sacrificar a jogabilidade nem a leitura das questões para obter mais FPS.

## Metas e mecanismos atuais (versão 3.2)
- Física, colisões, cronômetros, controles e pontuação continuam atualizados independentemente da frequência de desenho. Não atrelar a duração de uma partida ao FPS.
- O desenho da arena é adaptativo: até 60 FPS em hardware rápido e 30 FPS em dispositivos leves; se o custo ficar elevado, reduzir o ritmo de pintura automaticamente.
- Imagens dos cenários devem ser pré-renderizadas em superfície de cache, sem redimensionar a imagem original a cada frame.
- Variações de cor dos robôs devem ser preparadas no atlas previamente; **não** aplicar filtros de cor a cada frame.
- Manter elementos animados de forma leve e perceptível; respeitar "Reduzir movimento" do sistema.
- Os cálculos de quebra de linha das alternativas devem ser reutilizados até uma nova questão.
- A roleta deve girar por transformação CSS, e não redesenhar seus 600×600 pixels em cada frame.
- Não redesenhar/reatribuir o DOM várias vezes por segundo sem necessidade.
- O cache PWA deve mudar de versão em cada atualização publicada, incluindo todos os recursos offline novos.
- Nunca limpar as perguntas, as configurações ou o ranking em IndexedDB/localStorage ao atualizar.

## Checklist obrigatório a cada próxima mudança
1. Sintaxe dos módulos: index.html (scripts), eco-world.js, sw.js, pwa.js.
2. Roleta: escolha de Floresta/Tecnologia, alternância, giro completo, encaminhamento à pergunta e rodadas seguintes.
3. Clássico: 2 personagens, movimento simultâneo, confirmação independente Q/P e botões mobile, alternativas completas e resultado.
4. Rush: largada, cronômetro, plataformas que desaparecem/reaparecem, direito à pontuação, escolhas de ambos, bloqueio e últimos 5 segundos.
5. Treino: tutorial, corrida de treino, controles desktop e mobile.
6. Visual: imagens originais e animações leves; posição dos robôs; cor escolhida por cada jogador.
7. Responsividade: celular vertical/horizontal, telas pequenas, notebook e desktop; roleta e cartões devem caber com rolagem acessível.
8. Desempenho: não adicionar leituras/escritas de DOM ou `g.filter`, grandes sombras, reprocessamento de texto/imagem no laço `requestAnimationFrame`.
9. Persistência: reiniciar a página e validar que perguntas, nomes, cores e ranking permanecem armazenados.
10. PWA: confirmar manifesto, imagens, service worker, atualização de cache e uso offline.

## Como verificar no navegador
- Chrome/Edge: F12 → Performance → gravar ~15 segundos de uma partida com os dois personagens em movimento.
- Conferir se há travamentos perceptíveis, uso excessivo de CPU, erros no console ou elementos fora da tela.
- DevTools → Application → Service Workers e Cache Storage: validar a nova revisão do cache após atualizar.
- Validar em pelo menos um dispositivo móvel e um computador quando possível. Se não houver acesso a dispositivos reais, informar que os testes foram simulados e não alegar validação real.

## Regressão visual obrigatória após bug da versão 3.2 (corrigido na 3.3)
- Nunca combinar `getContext('2d',{desynchronized:true})` com limpeza completa do canvas em uma animação com FPS limitado: pode expor frames incompletos e causar piscadas.
- Desenhar o fundo opaco inteiro antes de plataformas, robôs, avisos e efeitos; não apagar o quadro entre pinturas.
- Em frames ignorados pelo limite de FPS, a imagem anterior deve permanecer intacta, sem `clearRect()` do canvas visível.
- Testar a ausência de piscadas tanto nos desenhos dentro da arena quanto nos cartões de alternativas do DOM, especialmente no modo Clássico, Rush e no celular em paisagem.
- Validar que plataformas temporárias do Rush desapareçam **somente** pelo efeito planejado e reapareçam suavemente; as demais plataformas devem permanecer sempre visíveis.

## Regressão obrigatória: questões de 4 ou 5 alternativas (3.4)
- Preservar os dados locais existentes e inserir pacotes uma única vez com checagem de perguntas semelhantes.
- Conferir letras A–D e A–E no editor, importação, roleta, alternativas, colisões, pontuação e resultado.
- Simular a plataforma E no Clássico e no Rush, mantendo quatro plataformas no Treino.
- Não calcular duplicatas durante os quadros de animação.

Este arquivo também serve como referência para futuras contribuições e melhorias do EcoData Arena.
