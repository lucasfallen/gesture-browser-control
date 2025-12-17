# Estrutura do Projeto - Gesture Browser Control

## Estrutura de Pastas

```
gesture-browser-control/
├── App.tsx                    # Componente principal da aplicação
├── components/                # Componentes React reutilizáveis
│   ├── CursorOverlay.tsx      # Overlay do cursor virtual na tela
│   └── WebcamPreview.tsx      # Preview da webcam com landmarks desenhados
├── hooks/                     # Custom hooks
│   └── useMediaPipe.ts        # Hook para integração com MediaPipe
├── docs/                      # Documentação do projeto
│   └── webcamgests.md         # Documentação de gestos (legado)
├── .cursor/                   # Regras e comandos do Cursor AI
│   ├── rules/                 # Regras de arquitetura, estilo, etc.
│   └── commands/              # Comandos customizados
├── types.ts                   # Definições TypeScript (interfaces, enums)
├── constants.ts               # Constantes e configurações
├── index.tsx                  # Entry point React
├── index.html                 # HTML base
├── index.css                  # Estilos globais (atualmente vazio)
├── vite.config.ts             # Configuração do Vite
├── tsconfig.json              # Configuração do TypeScript
├── package.json               # Dependências e scripts
└── README.md                  # Documentação principal
```

## Convenções de Nomenclatura

### Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | `PascalCase.tsx` | `CursorOverlay.tsx` |
| Hooks | `camelCase.ts` com prefixo `use` | `useMediaPipe.ts` |
| Types/Interfaces | `camelCase.ts` | `types.ts` |
| Constantes | `camelCase.ts` | `constants.ts` |
| Configuração | `kebab-case.ts` | `vite.config.ts` |

### Código

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | PascalCase | `CursorOverlay`, `WebcamPreview` |
| Funções | camelCase | `handlePinchRelease`, `triggerClick` |
| Constantes | UPPER_SNAKE_CASE | `PINCH_THRESHOLD`, `DOUBLE_CLICK_TIMEOUT` |
| Interfaces | PascalCase | `ScreenPoint`, `HandData` |
| Enums | PascalCase | `GestureType` |
| Props | camelCase | `isPinching`, `lastGesture` |
| Refs | camelCase com sufixo `Ref` | `videoRef`, `handDataRef` |

## Organização de Componentes

### Componente Principal: `App.tsx`

Estrutura:
```typescript
const App: React.FC = () => {
  // 1. Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 2. Hooks customizados
  const { isCameraReady, handDataRef, lastResultsRef, error } = useMediaPipe(videoRef);
  
  // 3. Estado local
  const [cursorPos, setCursorPos] = useState<ScreenPoint>({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  // ...
  
  // 4. Refs para lógica
  const wasPinchingRef = useRef(false);
  // ...
  
  // 5. Effects
  useEffect(() => {
    // Loop principal
  }, []);
  
  // 6. Handlers
  const handlePinchRelease = (pos: ScreenPoint) => { /* ... */ };
  const triggerClick = (pos: ScreenPoint, type: 'left' | 'right') => { /* ... */ };
  
  // 7. Render
  return (/* JSX */);
};
```

### Hook Customizado: `useMediaPipe.ts`

Estrutura:
```typescript
export const useMediaPipe = (videoRef: React.RefObject<HTMLVideoElement>) => {
  // 1. Estado
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Refs para dados
  const handDataRef = useRef<HandData>({ /* ... */ });
  const lastResultsRef = useRef<HandLandmarkerResult | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  
  // 3. Funções auxiliares
  const lerp = (start: number, end: number, factor: number) => { /* ... */ };
  const getDistance = (p1, p2) => { /* ... */ };
  
  // 4. Setup e processamento
  useEffect(() => {
    const setupMediaPipe = async () => { /* ... */ };
    const startCamera = async () => { /* ... */ };
    const predictWebcam = () => { /* ... */ };
    const processResults = (results) => { /* ... */ };
    
    setupMediaPipe();
    
    return () => {
      // Cleanup
    };
  }, [videoRef]);
  
  // 5. Retorno
  return { isCameraReady, handDataRef, lastResultsRef, error };
};
```

### Componente: `CursorOverlay.tsx`

Estrutura:
```typescript
interface CursorOverlayProps {
  position: ScreenPoint;
  isPinching: boolean;
  lastGesture: GestureType;
}

const CursorOverlay: React.FC<CursorOverlayProps> = ({ position, isPinching, lastGesture }) => {
  // 1. Funções auxiliares
  const getCursorColor = () => { /* ... */ };
  
  // 2. Render
  return (
    <div style={{ /* posicionamento */ }}>
      {/* Anel externo */}
      {/* Ponto interno */}
      {/* Animação de pulse */}
      {/* Label */}
    </div>
  );
};
```

### Componente: `WebcamPreview.tsx`

Estrutura:
```typescript
interface WebcamPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  resultsRef: React.MutableRefObject<HandLandmarkerResult | null>;
  isCameraReady: boolean;
}

const WebcamPreview: React.FC<WebcamPreviewProps> = ({ videoRef, resultsRef, isCameraReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const render = () => {
      // 1. Desenhar vídeo
      // 2. Desenhar landmarks
      // 3. Destacar dedo indicador
      requestAnimationFrame(render);
    };
    render();
    
    return () => { /* cleanup */ };
  }, [isCameraReady, videoRef, resultsRef]);
  
  if (!isCameraReady) return null;
  
  return (
    <div className="fixed bottom-4 right-4 ...">
      <canvas ref={canvasRef} />
    </div>
  );
};
```

## Padrões de Imports

Ordem recomendada:

```typescript
// 1. Bibliotecas externas
import React, { useRef, useState, useEffect } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { MousePointer2, Hand } from 'lucide-react';

// 2. Componentes locais
import WebcamPreview from './components/WebcamPreview';
import CursorOverlay from './components/CursorOverlay';

// 3. Hooks locais
import { useMediaPipe } from './hooks/useMediaPipe';

// 4. Types/Interfaces
import { GestureType, ScreenPoint } from './types';

// 5. Constantes
import { DOUBLE_CLICK_TIMEOUT } from './constants';
```

## Estrutura de Types

### `types.ts`

```typescript
// Enums
export enum GestureType {
  NONE = 'NONE',
  MOVE = 'MOVE',
  PINCH_START = 'PINCH_START',
  CLICK_LEFT = 'CLICK_LEFT',
  CLICK_RIGHT = 'CLICK_RIGHT'
}

// Interfaces
export interface ScreenPoint {
  x: number;
  y: number;
}

export interface HandData {
  cursor: ScreenPoint;
  isPinching: boolean;
  pinchDistance: number;
}
```

## Estrutura de Constantes

### `constants.ts`

```typescript
// Thresholds
export const PINCH_THRESHOLD = 0.05;
export const DOUBLE_CLICK_TIMEOUT = 300;
export const MOVEMENT_SMOOTHING = 0.15;

// Cores
export const CURSOR_COLORS = {
  default: '#3b82f6',
  pinching: '#ef4444',
  click: '#22c55e',
  rightClick: '#a855f7'
};

export const COLORS = {
  left: '#ef4444',
  right: '#3b82f6'
};
```

## Separação de Responsabilidades

### `App.tsx`
- **Responsabilidade**: Orquestração, UI principal, detecção de gestos
- **Não deve**: Processar vídeo diretamente, calcular landmarks

### `useMediaPipe.ts`
- **Responsabilidade**: Integração MediaPipe, processamento de vídeo, cálculo de dados da mão
- **Não deve**: Renderizar UI, detectar gestos complexos

### `CursorOverlay.tsx`
- **Responsabilidade**: Renderizar cursor virtual, feedback visual
- **Não deve**: Processar dados, calcular posições

### `WebcamPreview.tsx`
- **Responsabilidade**: Renderizar preview da webcam, desenhar landmarks
- **Não deve**: Processar detecção, calcular gestos

## Fluxo de Dados

```
[Webcam Stream]
    ↓
[useMediaPipe] → processa frames → atualiza handDataRef
    ↓
[App.tsx] → lê handDataRef em loop → atualiza estado UI
    ↓
[CursorOverlay] ← recebe props ← [App.tsx]
[WebcamPreview] ← recebe refs ← [App.tsx]
```

## Boas Práticas

1. **Componentes pequenos e focados**: Cada componente tem uma responsabilidade clara
2. **Hooks para lógica reutilizável**: `useMediaPipe` encapsula toda lógica MediaPipe
3. **Refs para dados mutáveis**: Evita re-renders desnecessários
4. **Types centralizados**: Todas as definições em `types.ts`
5. **Constantes centralizadas**: Configurações em `constants.ts`
6. **Cleanup adequado**: Todos os effects têm cleanup
