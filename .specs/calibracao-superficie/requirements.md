# Requisitos - Calibração de Superfície e Grid

## Visão Geral

Esta feature adiciona um modo de calibração que permite ao usuário definir uma área de trabalho física (superfície branca) que será mapeada para uma grid virtual na tela, simulando a área de trabalho de um notebook. O cursor funcionará dentro dessa grid, e os gestos de clique serão detectados através de movimentos de toque na superfície.

## Requisitos Funcionais

### RF-001: Modo de Calibração

**Descrição**: O sistema deve permitir alternar entre modo normal e modo de calibração de superfície.

**Critérios de Aceitação**:
- [ ] Deve existir um botão "Change Mode" ou "Modo Calibração" na interface
- [ ] Ao ativar o modo de calibração, a interface deve mostrar instruções claras
- [ ] O modo de calibração deve poder ser cancelado a qualquer momento
- [ ] Após calibração bem-sucedida, o sistema deve retornar ao modo de operação normal

**Prioridade**: Alta

### RF-002: Detecção de Superfície Branca

**Descrição**: O sistema deve detectar e delimitar uma superfície branca na imagem da câmera.

**Critérios de Aceitação**:
- [ ] Deve processar frames da webcam em tempo real durante calibração
- [ ] Deve identificar região branca/clara na imagem usando processamento de imagem
- [ ] Deve calcular os limites (bounding box) da superfície detectada
- [ ] Deve fornecer feedback visual mostrando a área detectada
- [ ] Deve validar que a superfície detectada tem tamanho mínimo (ex: 20% da imagem)
- [ ] Deve permitir confirmar ou recalibrar a detecção

**Prioridade**: Alta

**Dependências**: RF-001

### RF-003: Criação de Grid Virtual

**Descrição**: O sistema deve criar uma grid retangular que representa a área de trabalho mapeada da superfície física.

**Critérios de Aceitação**:
- [ ] A grid deve ser criada com base nas dimensões da superfície detectada
- [ ] A grid deve ser proporcional à área de trabalho do navegador
- [ ] A grid deve ser visualizada na interface (opcional, para debug)
- [ ] A grid deve ter coordenadas normalizadas (0-1) para mapeamento
- [ ] A grid deve ser persistida durante a sessão (até recalibração)

**Prioridade**: Alta

**Dependências**: RF-002

### RF-004: Mapeamento de Coordenadas

**Descrição**: O sistema deve mapear a posição da mão na superfície física para coordenadas dentro da grid virtual.

**Critérios de Aceitação**:
- [ ] Deve calcular posição relativa da mão dentro da superfície detectada
- [ ] Deve converter coordenadas da superfície para coordenadas da grid
- [ ] Deve converter coordenadas da grid para coordenadas da tela (pixels)
- [ ] O cursor deve se mover apenas dentro dos limites da grid
- [ ] O mapeamento deve considerar espelhamento horizontal (se necessário)

**Prioridade**: Alta

**Dependências**: RF-003

### RF-005: Detecção de Clique Esquerdo (Toque Indicador)

**Descrição**: O sistema deve detectar quando o usuário toca a superfície com o dedo indicador e simular clique esquerdo.

**Critérios de Aceitação**:
- [ ] Deve detectar movimento descendente do dedo indicador (landmark 8)
- [ ] Deve detectar quando o dedo indicador está próximo da superfície (coordenada Z baixa)
- [ ] Deve distinguir toque de movimento normal
- [ ] Deve disparar evento de clique esquerdo no elemento sob o cursor
- [ ] Deve fornecer feedback visual quando toque é detectado

**Prioridade**: Alta

**Dependências**: RF-004

### RF-006: Detecção de Clique Direito (Toque Dedo Médio)

**Descrição**: O sistema deve detectar quando o usuário toca a superfície com o dedo médio e simular clique direito.

**Critérios de Aceitação**:
- [ ] Deve detectar movimento descendente do dedo médio (landmark 12)
- [ ] Deve detectar quando o dedo médio está próximo da superfície (coordenada Z baixa)
- [ ] Deve distinguir toque de movimento normal
- [ ] Deve distinguir toque do dedo médio do toque do indicador
- [ ] Deve disparar evento de clique direito (contextmenu) no elemento sob o cursor
- [ ] Deve fornecer feedback visual quando toque é detectado

**Prioridade**: Alta

**Dependências**: RF-004

### RF-007: Modo de Operação Normal vs Grid

**Descrição**: O sistema deve permitir alternar entre modo normal (atual) e modo grid (novo).

**Critérios de Aceitação**:
- [ ] Deve manter modo normal funcionando como antes
- [ ] Deve permitir ativar/desativar modo grid sem recalibrar
- [ ] Deve indicar claramente qual modo está ativo
- [ ] Deve preservar calibração quando alternando entre modos

**Prioridade**: Média

**Dependências**: RF-001, RF-003

## Requisitos Não Funcionais

### RNF-001: Performance

**Descrição**: O processamento de detecção de superfície não deve degradar significativamente a performance.

**Critérios**:
- Processamento de detecção deve executar em < 100ms por frame
- Taxa de detecção deve manter-se em ~30fps mínimo

### RNF-002: Precisão

**Descrição**: O mapeamento de coordenadas deve ser preciso o suficiente para uso prático.

**Critérios**:
- Erro de mapeamento < 5% da área da grid
- Detecção de toque deve ter taxa de acerto > 90%

### RNF-003: Usabilidade

**Descrição**: O processo de calibração deve ser intuitivo e rápido.

**Critérios**:
- Calibração completa em < 30 segundos
- Feedback visual claro em todas as etapas
- Instruções textuais ou visuais para guiar o usuário

## Dependências com Features Existentes

### Integração com MediaPipe
- Utiliza `useMediaPipe` hook existente
- Utiliza landmarks da mão (8 = indicador, 12 = dedo médio)
- Mantém compatibilidade com detecção de pinch atual

### Integração com CursorOverlay
- Mantém componente `CursorOverlay` funcionando
- Adiciona visualização opcional da grid
- Mantém feedback visual de gestos

### Integração com App.tsx
- Adiciona estado para modo de calibração
- Adiciona estado para modo grid ativo
- Integra lógica de detecção de toque

## Limitações Conhecidas

1. **Iluminação**: Detecção de superfície branca depende de iluminação adequada
2. **Contraste**: Superfície deve ter contraste suficiente com fundo
3. **Tamanho**: Superfície muito pequena pode não ser detectada corretamente
4. **Profundidade**: Detecção de toque (Z) pode ser imprecisa dependendo do ângulo da câmera

## Cenários de Uso

### Cenário 1: Calibração Inicial
1. Usuário abre aplicação
2. Usuário clica em "Change Mode" → "Calibrate Surface"
3. Sistema mostra instruções: "Aponte câmera para superfície branca"
4. Usuário posiciona câmera sobre mesa branca
5. Sistema detecta superfície e mostra preview
6. Usuário confirma calibração
7. Grid é criada e modo grid é ativado

### Cenário 2: Uso Normal (Modo Grid)
1. Usuário move mão sobre superfície calibrada
2. Cursor se move dentro da grid na tela
3. Usuário toca superfície com indicador → Clique esquerdo
4. Usuário toca superfície com dedo médio → Clique direito

### Cenário 3: Recalibração
1. Usuário clica em "Change Mode" → "Calibrate Surface"
2. Sistema limpa calibração anterior
3. Processo de calibração reinicia

## Notas de Implementação

- Detecção de superfície pode usar técnicas de processamento de imagem:
  - Thresholding (binarização)
  - Contour detection (OpenCV.js ou Canvas API)
  - Color detection (HSV para branco)
- Detecção de toque pode usar:
  - Coordenada Z do landmark (profundidade)
  - Velocidade de movimento vertical
  - Threshold de distância Z

