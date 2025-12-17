# Estilo de Código - Gesture Browser Control

## TypeScript

### Configuração
- Modo strict recomendado
- Target: ES2022+
- Module: ESNext
- JSX: react-jsx

### Tipagem

```typescript
// CORRETO: Interfaces para objetos
interface ScreenPoint {
  x: number;
  y: number;
}

// CORRETO: Enums para conjuntos fixos
enum GestureType {
  NONE = 'NONE',
  CLICK_LEFT = 'CLICK_LEFT',
  CLICK_RIGHT = 'CLICK_RIGHT'
}

// CORRETO: Types para unions
type ClickType = 'left' | 'right';

// EVITAR: any - usar unknown quando necessário
function parseData(data: unknown): HandData {
  // Validar e fazer type assertion
  if (typeof data === 'object' && data !== null) {
    return data as HandData;
  }
  throw new Error('Invalid data');
}
```

### Exports

```typescript
// CORRETO: Exports nomeados para types
export enum GestureType { ... }
export interface ScreenPoint { ... }

// CORRETO: Default exports para componentes
export default CursorOverlay;

// CORRETO: Exports nomeados para hooks
export const useMediaPipe = (...) => { ... };
```

## React

### Componentes

```typescript
// CORRETO: Functional component com TypeScript
interface CursorOverlayProps {
  position: ScreenPoint;
  isPinching: boolean;
  lastGesture: GestureType;
}

const CursorOverlay: React.FC<CursorOverlayProps> = ({ 
  position, 
  isPinching, 
  lastGesture 
}) => {
  // ...
};

export default CursorOverlay;
```

### Hooks

```typescript
// CORRETO: Custom hook com retorno tipado
export const useMediaPipe = (
  videoRef: React.RefObject<HTMLVideoElement>
): {
  isCameraReady: boolean;
  handDataRef: React.MutableRefObject<HandData>;
  lastResultsRef: React.MutableRefObject<HandLandmarkerResult | null>;
  error: string | null;
} => {
  // ...
};
```

### Estado e Refs

```typescript
// CORRETO: useState para valores que afetam UI
const [cursorPos, setCursorPos] = useState<ScreenPoint>({ x: 0, y: 0 });
const [isPinching, setIsPinching] = useState(false);

// CORRETO: useRef para valores mutáveis que não causam re-render
const handDataRef = useRef<HandData>({
  cursor: { x: 0, y: 0 },
  isPinching: false,
  pinchDistance: 1
});

// CORRETO: useRef para elementos DOM
const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
```

### Effects

```typescript
// CORRETO: Effect com cleanup
useEffect(() => {
  let isActive = true;
  let animationFrameId: number;

  const setup = async () => {
    // Setup assíncrono
    if (!isActive) return;
    // ...
  };

  setup();

  return () => {
    isActive = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    // Limpar outros recursos
  };
}, [dependencies]);
```

## Nomenclatura

### Variáveis e Funções

```typescript
// CORRETO: camelCase para variáveis e funções
const cursorPos = { x: 100, y: 200 };
const handlePinchRelease = (pos: ScreenPoint) => { ... };
const triggerClick = (pos: ScreenPoint, type: 'left' | 'right') => { ... };

// CORRETO: UPPER_SNAKE_CASE para constantes
const PINCH_THRESHOLD = 0.05;
const DOUBLE_CLICK_TIMEOUT = 300;
const MOVEMENT_SMOOTHING = 0.15;
```

### Componentes e Types

```typescript
// CORRETO: PascalCase para componentes
const CursorOverlay: React.FC = () => { ... };
const WebcamPreview: React.FC = () => { ... };

// CORRETO: PascalCase para interfaces e types
interface ScreenPoint { ... }
type GestureType = 'NONE' | 'CLICK_LEFT' | 'CLICK_RIGHT';
enum GestureType { ... }
```

### Refs

```typescript
// CORRETO: camelCase com sufixo Ref
const videoRef = useRef<HTMLVideoElement>(null);
const handDataRef = useRef<HandData>({ ... });
const wasPinchingRef = useRef(false);
```

## Formatação

### Indentação
- 2 espaços (padrão do projeto)

### Ponto e Vírgula
- Sempre usar ponto e vírgula no final das linhas

### Aspas
- Aspas simples para strings (padrão do projeto)
- Aspas duplas para JSX attributes (padrão React)

### Linhas
- Máximo ~100 caracteres por linha
- Quebrar linhas longas de forma legível

### Espaçamento

```typescript
// CORRETO: Espaço após vírgula
const { x, y } = point;

// CORRETO: Espaço antes e depois de operadores
const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

// CORRETO: Linha em branco entre blocos lógicos
const setupMediaPipe = async () => {
  try {
    // ...
  } catch (err) {
    // ...
  }
};

const startCamera = async () => {
  // ...
};
```

## Imports

### Ordem

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

// 4. Types
import { GestureType, ScreenPoint } from './types';

// 5. Constantes
import { DOUBLE_CLICK_TIMEOUT } from './constants';
```

### Estilo

```typescript
// CORRETO: Imports nomeados
import { useState, useEffect } from 'react';

// CORRETO: Default imports
import App from './App';

// CORRETO: Imports com alias se necessário
import { HandLandmarker as HL } from '@mediapipe/tasks-vision';
```

## Funções

### Estrutura

```typescript
// CORRETO: Função com tipo de retorno explícito
const calculateDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

// CORRETO: Função assíncrona
const setupMediaPipe = async (): Promise<void> => {
  try {
    // ...
  } catch (err) {
    // ...
  }
};
```

### Parâmetros

```typescript
// CORRETO: Tipar todos os parâmetros
const handlePinchRelease = (pos: ScreenPoint): void => {
  // ...
};

// CORRETO: Parâmetros opcionais
const triggerClick = (
  pos: ScreenPoint,
  type: 'left' | 'right',
  delay?: number
): void => {
  // ...
};
```

## Tratamento de Erros

```typescript
// CORRETO: Try-catch em operações assíncronas
const setupMediaPipe = async () => {
  try {
    const vision = await FilesetResolver.forVisionTasks(...);
    // ...
  } catch (err: any) {
    console.error("Error initializing MediaPipe:", err);
    setError(`Failed to load tracking: ${err.message}`);
  }
};

// CORRETO: Validação antes de usar
if (!videoRef.current || !landmarkerRef.current) return;
```

## Comentários

### JSDoc para Funções Públicas

```typescript
/**
 * Calcula a distância euclidiana entre dois pontos
 * @param p1 - Primeiro ponto
 * @param p2 - Segundo ponto
 * @returns Distância entre os pontos
 */
const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};
```

### Comentários Inline

```typescript
// Landmark 8 é a ponta do dedo indicador
const indexTip = landmarks[8];

// Espelhar X porque é uma webcam (mover mão direita → cursor vai para direita)
const targetX = (1 - indexTip.x) * window.innerWidth;

// TODO: Adicionar suporte a scroll
// FIXME: Corrigir latência em dispositivos lentos
```

## Performance

### Otimizações

```typescript
// CORRETO: Usar refs para valores que não causam re-render
const handDataRef = useRef<HandData>({ ... });

// CORRETO: requestAnimationFrame para loops
useEffect(() => {
  let animationFrameId: number;
  const loop = () => {
    // Processar
    animationFrameId = requestAnimationFrame(loop);
  };
  loop();
  return () => cancelAnimationFrame(animationFrameId);
}, []);

// CORRETO: Cleanup adequado
useEffect(() => {
  // Setup
  return () => {
    // Cleanup: cancelar frames, fechar recursos, parar streams
  };
}, []);
```

## JSX

### Atributos

```typescript
// CORRETO: Aspas duplas para strings
<div className="fixed bottom-4 right-4">

// CORRETO: Chaves para expressões
<div style={{ left: position.x, top: position.y }}>

// CORRETO: Props booleanas
<video autoPlay muted playsInline />
```

### Formatação

```typescript
// CORRETO: Quebrar props longas
<WebcamPreview
  videoRef={videoRef}
  resultsRef={lastResultsRef}
  isCameraReady={isCameraReady}
/>

// CORRETO: Self-closing quando possível
<img src={src} alt={alt} />
```

## Licença

Todos os arquivos devem incluir o cabeçalho de licença:

```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
```
