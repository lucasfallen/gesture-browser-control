# Arquitetura - Gesture Browser Control

## Visão Geral

Aplicação React/TypeScript que permite controlar o cursor do mouse através de gestos de mão capturados pela webcam. Utiliza MediaPipe para detecção de landmarks da mão em tempo real.

## Arquitetura de Componentes

### Componente Principal: `App.tsx`

Responsabilidades:
- Gerenciar estado da aplicação (cursor, gestos, logs)
- Orquestrar comunicação entre MediaPipe e UI
- Detectar e processar gestos (pinch, clique)
- Renderizar interface principal

Fluxo de dados:
```
[Webcam] → [useMediaPipe] → [handDataRef] → [App.tsx] → [CursorOverlay + WebcamPreview]
```

### Hook Customizado: `useMediaPipe.ts`

Responsabilidades:
- Inicializar MediaPipe HandLandmarker
- Capturar stream da webcam
- Processar frames em `requestAnimationFrame`
- Calcular posição do cursor e estado de pinch
- Expor dados via refs (handDataRef, lastResultsRef)

Fluxo de processamento:
```
1. Setup MediaPipe (async)
2. Iniciar câmera (getUserMedia)
3. Loop de detecção (requestAnimationFrame)
4. Processar resultados (calcular cursor, pinch)
5. Atualizar refs
```

### Componente: `CursorOverlay.tsx`

Responsabilidades:
- Renderizar cursor virtual na tela
- Mostrar feedback visual de gestos (cor, tamanho, animações)
- Exibir labels de ações (Left Click, Right Click, Pinch...)

Características:
- Posicionamento absoluto fixo
- Z-index alto (9999) para ficar acima de tudo
- Transições suaves para mudanças de estado
- Animações de pulse em cliques

### Componente: `WebcamPreview.tsx`

Responsabilidades:
- Renderizar preview da webcam com landmarks desenhados
- Mostrar conexões entre pontos da mão
- Destacar dedo indicador (landmark 8)
- Aplicar espelhamento horizontal

Características:
- Canvas para renderização customizada
- Overlay no canto inferior direito
- Opacidade reduzida para não interferir
- Atualização em tempo real via requestAnimationFrame

## Fluxo de Dados

### 1. Inicialização

```
App.tsx monta
  ↓
useMediaPipe inicializa
  ↓
MediaPipe HandLandmarker carrega (async)
  ↓
Câmera inicia (getUserMedia)
  ↓
isCameraReady = true
```

### 2. Loop de Detecção

```
requestAnimationFrame (60fps)
  ↓
MediaPipe detectForVideo(video, timestamp)
  ↓
processResults(results)
  ↓
Calcular cursor (landmark 8, espelhamento X)
  ↓
Calcular pinch (distância landmark 8 ↔ 4)
  ↓
Atualizar handDataRef.current
  ↓
App.tsx lê handDataRef em loop separado
  ↓
Atualizar UI (cursorPos, isPinching)
```

### 3. Detecção de Gestos

```
Pinch detectado (isPinching = true)
  ↓
wasPinchingRef.current = true
  ↓
Pinch liberado (isPinching = false)
  ↓
handlePinchRelease()
  ↓
clickCountRef.current++
  ↓
Timer DOUBLE_CLICK_TIMEOUT
  ↓
Se clickCount === 1 → triggerClick('left')
Se clickCount >= 2 → triggerClick('right')
```

### 4. Interação com DOM

```
triggerClick(pos, type)
  ↓
elementFromPoint(pos.x, pos.y)
  ↓
Se type === 'left': element.click()
Se type === 'right': dispatchEvent(contextmenu)
```

## Estrutura de Estado

### Estado do App (`App.tsx`)
- `cursorPos: ScreenPoint` - Posição atual do cursor
- `isPinching: boolean` - Estado de pinch
- `detectedGesture: GestureType` - Último gesto detectado
- `logs: string[]` - Logs de eventos (últimos 5)
- `testBoxColor: string` - Cor do box de teste
- `testMessage: string` - Mensagem do box de teste

### Refs do App
- `wasPinchingRef` - Estado anterior de pinch (para detectar rising edge)
- `pinchReleaseTimerRef` - Timer para double click
- `clickCountRef` - Contador de cliques rápidos

### Estado do MediaPipe (`useMediaPipe.ts`)
- `isCameraReady: boolean` - Câmera inicializada
- `error: string | null` - Erro de inicialização
- `handDataRef: HandData` - Dados processados da mão
- `lastResultsRef: HandLandmarkerResult` - Resultados brutos do MediaPipe
- `landmarkerRef: HandLandmarker` - Instância do landmarker
- `requestRef: number` - ID do requestAnimationFrame

## Comunicação entre Componentes

### App ↔ useMediaPipe
- **Props**: `videoRef` (ref do elemento video)
- **Retorno**: `{ isCameraReady, handDataRef, lastResultsRef, error }`
- **Comunicação**: Via refs mutáveis (handDataRef, lastResultsRef)

### App → CursorOverlay
- **Props**: `position`, `isPinching`, `lastGesture`
- **Comunicação**: Props reativas (causam re-render)

### App → WebcamPreview
- **Props**: `videoRef`, `resultsRef`, `isCameraReady`
- **Comunicação**: Via refs (videoRef, resultsRef)

## Performance

### Otimizações Implementadas

1. **Suavização de Movimento**
   - Lerp (linear interpolation) com `MOVEMENT_SMOOTHING = 0.15`
   - Reduz jitter e movimentos bruscos

2. **Processamento Assíncrono**
   - MediaPipe roda em `requestAnimationFrame` (60fps)
   - App lê dados em loop separado (também 60fps)
   - Não bloqueia UI thread

3. **Uso de Refs**
   - `handDataRef` evita re-renders desnecessários
   - Dados atualizados sem causar re-render de componentes

4. **Cleanup Adequado**
   - Cancela `requestAnimationFrame` no unmount
   - Fecha `HandLandmarker` corretamente
   - Para tracks da câmera

### Limitações Conhecidas

- Depende de iluminação adequada
- Requer mão visível na câmera
- Latência de ~100-200ms (processamento + suavização)
- Consumo de CPU/GPU para processamento de vídeo

## Segurança e Privacidade

- Stream de vídeo processado localmente (não enviado para servidor)
- MediaPipe roda no cliente (WASM)
- Sem armazenamento de imagens/vídeo
- Permissão de câmera solicitada via `getUserMedia`

## Extensibilidade

### Adicionar Novos Gestos

1. Adicionar tipo em `GestureType` enum
2. Implementar lógica de detecção em `App.tsx` ou `useMediaPipe.ts`
3. Adicionar feedback visual em `CursorOverlay.tsx`
4. Atualizar constantes se necessário

### Melhorar Precisão

- Ajustar `PINCH_THRESHOLD` em `constants.ts`
- Modificar `MOVEMENT_SMOOTHING` para menos lag (mais jitter) ou mais suavidade (mais lag)
- Ajustar confianças do MediaPipe (`minHandDetectionConfidence`, etc.)

### Adicionar Novos Controles

- Scroll: Detectar movimento vertical do dedo
- Drag: Detectar pinch mantido + movimento
- Zoom: Detectar distância entre duas mãos
