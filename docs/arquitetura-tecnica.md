# Arquitetura Técnica - Gesture Browser Control

## Visão Geral

Este documento descreve a arquitetura técnica da aplicação, incluindo fluxo de dados, componentes, e decisões de design.

## Stack Tecnológica

### Frontend
- **React 19.2.0**: Framework UI
- **TypeScript 5.8.2**: Tipagem estática
- **Vite 6.2.0**: Build tool e dev server
- **Tailwind CSS**: Estilização (via CDN)

### Visão Computacional
- **MediaPipe Tasks Vision 0.10.9**: Biblioteca de ML para detecção de mãos
- **HandLandmarker**: Modelo pré-treinado para detecção de 21 landmarks da mão

### UI/UX
- **Lucide React**: Ícones
- **Canvas API**: Renderização de landmarks

## Arquitetura de Componentes

### Hierarquia

```
App.tsx (Root)
├── useMediaPipe (Hook)
│   └── MediaPipe HandLandmarker
├── CursorOverlay (Componente)
└── WebcamPreview (Componente)
```

### Fluxo de Dados

```
1. Webcam Stream
   ↓
2. MediaPipe HandLandmarker
   ↓ (processa frames)
3. HandLandmarkerResult
   ↓ (calcula posição e pinch)
4. handDataRef (Ref mutável)
   ↓ (lido em loop)
5. App.tsx State
   ↓ (atualiza UI)
6. CursorOverlay + WebcamPreview
```

## Componentes Principais

### App.tsx

**Responsabilidades**:
- Gerenciar estado da aplicação
- Orquestrar comunicação entre componentes
- Detectar gestos complexos (clique simples vs duplo)
- Renderizar interface principal

**Estado**:
- `cursorPos`: Posição atual do cursor
- `isPinching`: Estado de pinch
- `detectedGesture`: Último gesto detectado
- `logs`: Logs de eventos
- `testBoxColor`, `testMessage`: Estado do box de teste

**Lógica de Gestos**:
- Detecta "rising edge" de pinch (transição de true → false)
- Conta cliques rápidos para distinguir simples vs duplo
- Usa timer para aguardar segundo pinch

### useMediaPipe.ts

**Responsabilidades**:
- Inicializar MediaPipe HandLandmarker
- Capturar stream da webcam
- Processar frames em tempo real
- Calcular dados da mão (cursor, pinch)

**Fluxo de Inicialização**:
```
1. setupMediaPipe() (async)
   ├── FilesetResolver.forVisionTasks() (carrega WASM)
   ├── HandLandmarker.createFromOptions() (carrega modelo)
   └── startCamera() (getUserMedia)
2. predictWebcam() (loop)
   ├── detectForVideo() (processa frame)
   └── processResults() (calcula dados)
```

**Processamento de Frames**:
- Executa em `requestAnimationFrame` (60fps)
- Para cada frame:
  1. Chama `detectForVideo(video, timestamp)`
  2. Obtém landmarks da primeira mão detectada
  3. Calcula posição do cursor (landmark 8)
  4. Calcula distância pinch (landmark 4 ↔ 8)
  5. Atualiza `handDataRef.current`

**Cálculos**:

```typescript
// Posição do cursor (landmark 8 = Index Tip)
targetX = (1 - indexTip.x) * window.innerWidth  // Espelhamento
targetY = indexTip.y * window.innerHeight

// Suavização (Lerp)
newX = lerp(currentX, targetX, MOVEMENT_SMOOTHING)
newY = lerp(currentY, targetY, MOVEMENT_SMOOTHING)

// Pinch (distância entre landmark 4 e 8)
distance = sqrt((thumbTip.x - indexTip.x)² + (thumbTip.y - indexTip.y)²)
isPinching = distance < PINCH_THRESHOLD
```

### CursorOverlay.tsx

**Responsabilidades**:
- Renderizar cursor virtual na tela
- Mostrar feedback visual de gestos
- Exibir labels de ações

**Posicionamento**:
- `position: fixed`
- `z-index: 9999` (sempre no topo)
- `transform: translate(-50%, -50%)` (centralizado no ponto)

**Estados Visuais**:
- Normal: Azul, 30px
- Pinching: Vermelho, 40px
- Click Left: Verde, animação pulse
- Click Right: Roxo, animação pulse

### WebcamPreview.tsx

**Responsabilidades**:
- Renderizar preview da webcam
- Desenhar landmarks e conexões
- Destacar dedo indicador

**Renderização**:
- Canvas com dimensões do vídeo
- Vídeo espelhado (opacidade 0.8)
- Landmarks desenhados como pontos
- Conexões desenhadas como linhas
- Dedo indicador destacado (ponto branco maior)

**Cores**:
- Mão esquerda: Vermelho
- Mão direita: Azul

## Fluxo de Detecção de Gestos

### 1. Detecção de Pinch

```
Frame N: isPinching = false
Frame N+1: isPinching = true  → Pinch iniciado
Frame N+2: isPinching = true  → Pinch mantido
Frame N+3: isPinching = false → Pinch liberado (rising edge detectado)
```

### 2. Clique Esquerdo

```
Pinch liberado
  ↓
clickCountRef.current = 1
  ↓
Timer DOUBLE_CLICK_TIMEOUT (300ms)
  ↓
Se nenhum segundo pinch → triggerClick('left')
```

### 3. Clique Direito

```
Pinch liberado (1º)
  ↓
clickCountRef.current = 1
  ↓
Timer DOUBLE_CLICK_TIMEOUT (300ms)
  ↓
Pinch liberado (2º) dentro do timeout
  ↓
clickCountRef.current = 2
  ↓
triggerClick('right')
```

## Interação com DOM

### Clique Esquerdo

```typescript
const element = document.elementFromPoint(pos.x, pos.y);
if (element) {
  element.click();  // Dispara evento click nativo
  element.focus();   // Foca o elemento
}
```

### Clique Direito

```typescript
const element = document.elementFromPoint(pos.x, pos.y);
if (element) {
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: pos.x,
    clientY: pos.y
  });
  element.dispatchEvent(event);  // Dispara evento contextmenu
}
```

## Performance

### Otimizações Implementadas

1. **RequestAnimationFrame**
   - Loop sincronizado com refresh rate (60fps)
   - Evita processamento desnecessário

2. **Refs vs State**
   - Dados de detecção em refs (não causam re-render)
   - State apenas para valores que afetam UI

3. **Suavização (Lerp)**
   - Interpolação linear reduz jitter
   - Trade-off: mais suavidade = mais lag

4. **Cleanup Adequado**
   - Cancela animation frames
   - Fecha HandLandmarker
   - Para tracks da câmera

### Limitações de Performance

- Processamento de vídeo é CPU/GPU intensivo
- MediaPipe roda em WASM (pode ser lento em dispositivos fracos)
- Latência inerente ao processamento (~100-200ms)

## Segurança e Privacidade

- **Processamento Local**: Tudo roda no cliente, sem envio de dados
- **Sem Armazenamento**: Nenhuma imagem/vídeo é salva
- **Permissão Explícita**: Câmera solicitada via `getUserMedia`
- **Sem Tracking**: Nenhum analytics ou tracking

## Extensibilidade

### Adicionar Novos Gestos

1. Adicionar tipo em `GestureType` enum
2. Implementar lógica de detecção em `App.tsx` ou `useMediaPipe.ts`
3. Adicionar feedback visual em `CursorOverlay.tsx`
4. Atualizar constantes se necessário

### Melhorar Precisão

- Ajustar `PINCH_THRESHOLD` em `constants.ts`
- Modificar `MOVEMENT_SMOOTHING` para menos lag ou mais suavidade
- Ajustar confianças do MediaPipe

### Adicionar Novos Controles

- **Scroll**: Detectar movimento vertical do dedo
- **Drag**: Detectar pinch mantido + movimento
- **Zoom**: Detectar distância entre duas mãos

## Decisões de Design

### Por que Refs em vez de State?

Refs são usados para `handDataRef` e `lastResultsRef` porque:
- Atualizações não precisam causar re-render
- Melhor performance (menos re-renders)
- Dados atualizados em 60fps sem impacto na UI

### Por que Lerp (Suavização)?

Lerp é usado para:
- Reduzir jitter natural da detecção
- Criar movimento mais suave e natural
- Melhorar experiência do usuário

Trade-off: Mais suavidade = mais lag (~100-200ms)

### Por que Timer para Double Click?

Timer é usado para:
- Distinguir clique simples de duplo
- Aguardar segundo pinch antes de disparar ação
- Evitar falsos positivos

## Troubleshooting Técnico

### MediaPipe não inicializa

- Verificar conexão com internet (modelo carregado via CDN)
- Verificar suporte a WebAssembly
- Verificar console para erros

### Câmera não inicia

- Verificar permissões do navegador
- Verificar se outra aplicação está usando a câmera
- Verificar se câmera está funcionando

### Performance ruim

- Reduzir resolução da câmera
- Aumentar `MOVEMENT_SMOOTHING` (mais lag, menos processamento)
- Fechar outras aplicações pesadas

