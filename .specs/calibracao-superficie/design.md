# Design - Calibração de Superfície e Grid

## Visão Geral da Arquitetura

Esta feature adiciona uma camada de calibração e mapeamento de coordenadas sobre a arquitetura existente, mantendo compatibilidade com o modo de operação atual.

## Componentes Novos

### 1. `useSurfaceCalibration.ts` (Hook)

**Localização**: `hooks/useSurfaceCalibration.ts`

**Responsabilidades**:
- Detectar superfície branca na imagem da câmera
- Calcular bounding box da superfície
- Criar e gerenciar grid virtual
- Mapear coordenadas da superfície para grid
- Mapear coordenadas da grid para tela

**Interface**:
```typescript
interface SurfaceCalibration {
  isCalibrating: boolean;
  isGridMode: boolean;
  gridBounds: GridBounds | null;
  startCalibration: () => void;
  cancelCalibration: () => void;
  confirmCalibration: () => void;
  mapToGrid: (handPosition: ScreenPoint) => ScreenPoint | null;
  toggleGridMode: () => void;
}
```

**Algoritmo de Detecção**:
1. Capturar frame do vídeo
2. Converter para canvas
3. Aplicar threshold para detectar áreas brancas/claras
4. Encontrar maior contorno (superfície)
5. Calcular bounding box retangular
6. Validar tamanho mínimo

### 2. `useTouchDetection.ts` (Hook)

**Localização**: `hooks/useTouchDetection.ts`

**Responsabilidades**:
- Detectar toque do dedo indicador na superfície
- Detectar toque do dedo médio na superfície
- Distinguir entre movimento normal e toque
- Retornar eventos de toque para App.tsx

**Interface**:
```typescript
interface TouchDetection {
  isTouching: boolean;
  touchType: 'index' | 'middle' | null;
  onTouchStart: (type: 'index' | 'middle') => void;
  onTouchEnd: () => void;
}
```

**Algoritmo de Detecção**:
1. Monitorar coordenada Z do landmark (profundidade)
2. Detectar movimento descendente rápido (velocidade)
3. Detectar quando Z < threshold (proximidade da superfície)
4. Identificar qual dedo está tocando (landmark 8 vs 12)
5. Disparar evento após confirmação (evitar falsos positivos)

### 3. `SurfaceCalibrationUI.tsx` (Componente)

**Localização**: `components/SurfaceCalibrationUI.tsx`

**Responsabilidades**:
- Renderizar interface de calibração
- Mostrar preview da detecção de superfície
- Mostrar instruções ao usuário
- Botões de confirmar/cancelar

**Props**:
```typescript
interface SurfaceCalibrationUIProps {
  isCalibrating: boolean;
  detectedSurface: BoundingBox | null;
  onConfirm: () => void;
  onCancel: () => void;
}
```

### 4. `GridOverlay.tsx` (Componente)

**Localização**: `components/GridOverlay.tsx`

**Responsabilidades**:
- Renderizar grid virtual na tela (opcional, para debug)
- Mostrar limites da área de trabalho
- Feedback visual quando cursor está dentro/fora da grid

**Props**:
```typescript
interface GridOverlayProps {
  gridBounds: GridBounds;
  isVisible: boolean; // Para debug/desenvolvimento
}
```

## Mudanças em Componentes Existentes

### `App.tsx`

**Mudanças**:
- Adicionar estado para modo de calibração
- Adicionar estado para modo grid ativo
- Integrar `useSurfaceCalibration`
- Integrar `useTouchDetection`
- Modificar lógica de movimento do cursor para usar grid quando ativo
- Substituir lógica de pinch por lógica de toque quando em modo grid
- Adicionar botão "Change Mode" na UI

**Novos Estados**:
```typescript
const [calibrationMode, setCalibrationMode] = useState<'normal' | 'calibrating' | 'grid'>('normal');
const [gridModeActive, setGridModeActive] = useState(false);
```

**Lógica Condicional**:
```typescript
// No loop principal
if (gridModeActive && gridBounds) {
  // Usar mapeamento de grid
  const gridPos = mapToGrid(handData.cursor);
  if (gridPos) {
    setCursorPos(gridPos);
  }
} else {
  // Modo normal (atual)
  setCursorPos(handData.cursor);
}

// Detecção de clique
if (gridModeActive) {
  // Usar detecção de toque
  if (touchDetection.touchType === 'index') {
    triggerClick(cursorPos, 'left');
  } else if (touchDetection.touchType === 'middle') {
    triggerClick(cursorPos, 'right');
  }
} else {
  // Usar detecção de pinch (atual)
  // ... código existente
}
```

### `useMediaPipe.ts`

**Mudanças**:
- Expor coordenada Z dos landmarks (se disponível)
- Adicionar método para obter frame atual do vídeo (para calibração)
- Manter compatibilidade total com código existente

**Adições**:
```typescript
// Adicionar ao HandData
export interface HandData {
  cursor: ScreenPoint;
  isPinching: boolean;
  pinchDistance: number;
  landmarks?: NormalizedLandmark[]; // Para acesso a coordenadas Z
}

// Método para capturar frame
const getCurrentFrame = (): HTMLCanvasElement | null => {
  // Captura frame do vídeo para processamento
};
```

### `types.ts`

**Novos Tipos**:
```typescript
export interface BoundingBox {
  x: number; // Coordenada X normalizada (0-1)
  y: number; // Coordenada Y normalizada (0-1)
  width: number; // Largura normalizada (0-1)
  height: number; // Altura normalizada (0-1)
}

export interface GridBounds {
  surfaceBox: BoundingBox; // Bounding box na imagem da câmera
  screenBox: BoundingBox; // Bounding box na tela (pixels)
  aspectRatio: number; // Proporção largura/altura
}

export interface CalibrationState {
  mode: 'normal' | 'calibrating' | 'grid';
  gridBounds: GridBounds | null;
  isActive: boolean;
}
```

### `constants.ts`

**Novas Constantes**:
```typescript
// Detecção de superfície
export const SURFACE_WHITE_THRESHOLD = 200; // Valor RGB mínimo para considerar branco
export const SURFACE_MIN_SIZE = 0.2; // 20% da imagem mínima
export const SURFACE_DETECTION_INTERVAL = 100; // ms entre detecções

// Detecção de toque
export const TOUCH_Z_THRESHOLD = 0.1; // Coordenada Z máxima para considerar toque
export const TOUCH_VELOCITY_THRESHOLD = 0.02; // Velocidade vertical mínima
export const TOUCH_CONFIRMATION_FRAMES = 3; // Frames consecutivos para confirmar toque

// Grid
export const GRID_MARGIN = 0.05; // Margem da grid (5% da tela)
```

## Fluxo de Dados

### Fluxo de Calibração

```
1. Usuário clica "Change Mode" → "Calibrate"
   ↓
2. App.tsx → setCalibrationMode('calibrating')
   ↓
3. useSurfaceCalibration → startCalibration()
   ↓
4. Loop de detecção (a cada 100ms):
   - Captura frame do vídeo
   - Processa imagem (threshold, contours)
   - Detecta superfície branca
   - Calcula bounding box
   - Atualiza detectedSurface
   ↓
5. SurfaceCalibrationUI → Mostra preview
   ↓
6. Usuário confirma
   ↓
7. useSurfaceCalibration → confirmCalibration()
   - Cria GridBounds
   - Calcula mapeamento
   ↓
8. App.tsx → setCalibrationMode('grid'), setGridModeActive(true)
```

### Fluxo de Mapeamento (Modo Grid)

```
1. useMediaPipe → Detecta mão, retorna landmarks
   ↓
2. useSurfaceCalibration → mapToGrid(handPosition)
   - Calcula posição relativa na superfície
   - Converte para coordenadas da grid
   - Converte para coordenadas da tela
   ↓
3. App.tsx → setCursorPos(mappedPosition)
   ↓
4. CursorOverlay → Renderiza cursor na posição
```

### Fluxo de Detecção de Toque

```
1. useMediaPipe → Retorna landmarks com coordenada Z
   ↓
2. useTouchDetection → Analisa movimento e profundidade
   - Calcula velocidade vertical
   - Verifica coordenada Z
   - Identifica dedo (8 = indicador, 12 = médio)
   ↓
3. Se toque detectado:
   - Dispara onTouchStart(type)
   ↓
4. App.tsx → triggerClick(pos, type)
   ↓
5. DOM → Dispara evento click/contextmenu
```

## Integração com Arquitetura Existente

### Compatibilidade

- **Modo Normal**: Mantém funcionamento exato como antes
- **Modo Grid**: Adiciona nova funcionalidade sem quebrar código existente
- **Hooks**: Novos hooks são opcionais, não afetam `useMediaPipe` existente

### Performance

- Detecção de superfície roda em intervalo (não a cada frame)
- Processamento de imagem usa Canvas API (nativo, rápido)
- Mapeamento de coordenadas é O(1) (cálculo simples)
- Detecção de toque usa apenas landmarks já calculados

### Extensibilidade

- Grid pode ser estendida para suportar múltiplas áreas
- Detecção de toque pode ser estendida para outros dedos
- Calibração pode ser salva em localStorage para persistência

## Riscos e Mitigações

### Risco 1: Detecção de Superfície Imprecisa

**Problema**: Superfície branca pode não ser detectada corretamente em diferentes condições de iluminação.

**Mitigação**:
- Usar threshold adaptativo baseado em histograma da imagem
- Permitir ajuste manual do threshold
- Validar tamanho mínimo da superfície detectada
- Mostrar preview antes de confirmar

### Risco 2: Detecção de Toque com Falsos Positivos

**Problema**: Movimentos normais podem ser interpretados como toque.

**Mitigação**:
- Usar múltiplos critérios (Z + velocidade + frames consecutivos)
- Adicionar debounce/confirmação antes de disparar evento
- Permitir ajuste de sensibilidade
- Feedback visual para debug

### Risco 3: Performance Degradada

**Problema**: Processamento de imagem pode ser pesado.

**Mitigação**:
- Processar em intervalos (não a cada frame)
- Reduzir resolução da imagem para processamento
- Usar Web Workers se necessário
- Otimizar algoritmos de detecção

### Risco 4: Coordenada Z Imprecisa

**Problema**: MediaPipe pode não fornecer coordenada Z precisa o suficiente.

**Mitigação**:
- Usar combinação de Z + velocidade + posição relativa
- Calibrar threshold de Z baseado na distância da câmera
- Fallback para detecção baseada apenas em movimento se Z não disponível

## Side Effects

### Positivos
- Melhora precisão do cursor (área de trabalho definida)
- Experiência mais natural (tocar superfície vs gestos no ar)
- Melhor para uso prolongado (menos fadiga)

### Negativos
- Requer calibração inicial (barreira de entrada)
- Depende de superfície branca (limitação física)
- Pode confundir usuários acostumados com modo normal

### Mitigações
- Tutorial/onboarding para primeira calibração
- Modo normal continua disponível
- Feedback visual claro sobre qual modo está ativo

## Testes Recomendados

### Testes Unitários
- `useSurfaceCalibration`: Detecção de superfície, cálculo de grid
- `useTouchDetection`: Detecção de toque, identificação de dedo
- Funções de mapeamento de coordenadas

### Testes de Integração
- Fluxo completo de calibração
- Alternância entre modos
- Mapeamento de cursor em modo grid

### Testes Manuais
- Diferentes condições de iluminação
- Diferentes tamanhos de superfície
- Diferentes ângulos de câmera
- Precisão de toque (taxa de acerto)

