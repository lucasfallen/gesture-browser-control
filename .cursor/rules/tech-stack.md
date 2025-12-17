# Stack Tecnológica - Gesture Browser Control

## Core

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 19.2.0 | Framework UI |
| **TypeScript** | 5.8.2 | Tipagem estática |
| **Vite** | 6.2.0 | Build tool e dev server |

## Visão Computacional

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **@mediapipe/tasks-vision** | 0.10.9 | Detecção de landmarks da mão |
| **MediaPipe HandLandmarker** | - | Modelo de ML para detecção de mãos |

### Configuração MediaPipe

```typescript
{
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/...",
    delegate: "GPU" // Usa GPU quando disponível
  },
  runningMode: "VIDEO", // Modo contínuo
  numHands: 1, // Apenas uma mão
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minTrackingConfidence: 0.5
}
```

### Recursos MediaPipe

- **Landmarks**: 21 pontos por mão (polegar, indicador, médio, anelar, mindinho)
- **Handedness**: Detecta se é mão esquerda ou direita
- **Confidence**: Níveis de confiança para detecção, presença e tracking

## UI e Estilização

| Tecnologia | Uso |
|------------|-----|
| **Tailwind CSS** | Framework CSS (via CDN) |
| **Lucide React** | Biblioteca de ícones |

### Tailwind CSS

- Carregado via CDN no `index.html`
- Classes utilitárias para layout e estilização
- Design system com cores customizadas (slate, blue, green, purple, red)

## Build e Desenvolvimento

### Vite

**Configuração** (`vite.config.ts`):
- Porta: 3000
- Host: 0.0.0.0 (acessível na rede local)
- Plugin React
- Alias `@` para raiz do projeto
- Suporte a variáveis de ambiente

**Scripts NPM**:
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
```

### TypeScript

**Configuração** (`tsconfig.json`):
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Module Resolution: bundler
- Paths: `@/*` → `./*`

## Estrutura de Dependências

### Produção

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@mediapipe/tasks-vision": "0.10.9",
  "lucide-react": "0.436.0"
}
```

**Nota**: Three.js e React Three Fiber estão no `package.json` mas não são usados no código atual. Podem ser remanescentes de outro projeto.

### Desenvolvimento

```json
{
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

## APIs do Navegador Utilizadas

### MediaDevices API

```typescript
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'user', // Câmera frontal
    width: { ideal: 640 },
    height: { ideal: 480 }
  }
})
```

### Canvas API

- Usado em `WebcamPreview.tsx` para desenhar landmarks
- Operações: `drawImage`, `stroke`, `fill`, `arc`
- Transformações: `scale`, `translate` para espelhamento

### DOM API

- `document.elementFromPoint(x, y)` - Encontrar elemento sob cursor
- `element.click()` - Disparar clique
- `element.dispatchEvent()` - Disparar eventos customizados
- `requestAnimationFrame` - Loop de animação

## Performance

### Otimizações

1. **RequestAnimationFrame**
   - Loop de detecção sincronizado com refresh rate (60fps)
   - Evita processamento desnecessário

2. **Refs vs State**
   - Dados de detecção em refs (não causam re-render)
   - State apenas para valores que afetam UI

3. **Suavização (Lerp)**
   - Interpolação linear reduz jitter
   - Trade-off: mais suavidade = mais lag

4. **Cleanup**
   - Cancela animation frames no unmount
   - Libera recursos da câmera
   - Fecha HandLandmarker corretamente

### Limitações

- Processamento de vídeo é CPU/GPU intensivo
- MediaPipe roda em WASM (pode ser lento em dispositivos fracos)
- Latência inerente ao processamento de frames

## Variáveis de Ambiente

Atualmente não há variáveis de ambiente necessárias. O projeto funciona completamente no cliente.

**Potenciais variáveis futuras**:
```env
VITE_MEDIAPIPE_MODEL_URL=...  # URL customizada do modelo
VITE_PINCH_THRESHOLD=0.05     # Threshold ajustável
VITE_SMOOTHING_FACTOR=0.15     # Fator de suavização
```

## Compatibilidade

### Navegadores

- **Chrome/Edge**: Suporte completo (recomendado)
- **Firefox**: Suporte completo
- **Safari**: Suporte completo (requer HTTPS para getUserMedia)
- **Mobile**: Limitado (getUserMedia pode ter restrições)

### Requisitos

- Webcam disponível
- Permissão de câmera concedida
- JavaScript habilitado
- Suporte a WebAssembly (para MediaPipe)
- GPU recomendada (mas não obrigatória)

## Segurança

- Sem dados enviados para servidor
- Processamento 100% local
- Permissão de câmera solicitada explicitamente
- Sem armazenamento de imagens/vídeo
- Sem tracking ou analytics

## Estrutura de Arquivos

```
gesture-browser-control/
├── App.tsx                    # Componente principal
├── components/
│   ├── CursorOverlay.tsx      # Cursor virtual
│   └── WebcamPreview.tsx      # Preview com landmarks
├── hooks/
│   └── useMediaPipe.ts        # Hook MediaPipe
├── types.ts                   # Definições TypeScript
├── constants.ts               # Constantes
├── index.tsx                  # Entry point
├── index.html                 # HTML base
├── index.css                  # Estilos globais
├── vite.config.ts             # Config Vite
├── tsconfig.json              # Config TypeScript
└── package.json               # Dependências
```

## Próximos Passos Tecnológicos

### Melhorias Potenciais

1. **Web Workers**
   - Mover processamento MediaPipe para worker
   - Reduzir carga na thread principal

2. **WebGPU**
   - Acelerar processamento com GPU
   - MediaPipe já suporta via delegate: "GPU"

3. **Offline Support**
   - Service Worker para cache
   - Funcionar sem internet após primeiro carregamento

4. **PWA**
   - Instalável como app
   - Funciona offline
   - Ícone e splash screen
