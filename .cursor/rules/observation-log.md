# Registro de Observações e Diretrizes - Gesture Browser Control

## Diretrizes para o Agente

### Antes de Qualquer Alteração
1. Leia `architecture.md` para entender a estrutura atual
2. Leia `tech-stack.md` para garantir consistência tecnológica
3. Verifique `product.md` para alinhar com os objetivos do produto
4. Consulte `structure.md` para seguir os padrões de código
5. Consulte `coding-style.md` para manter consistência de estilo

### Ao Implementar Features

#### Estrutura Obrigatória
- Componentes em `components/`
- Hooks customizados em `hooks/`
- Types em `types.ts`
- Constantes em `constants.ts`
- Documentação em `docs/`

#### Padrões de Código
- Usar TypeScript para todas as interfaces e tipos
- Componentes funcionais com hooks
- Usar `useRef` para valores mutáveis que não causam re-render
- Usar `useState` apenas para estado que afeta UI
- Sempre fazer cleanup em `useEffect` (cancelAnimationFrame, close resources, stop tracks)

#### MediaPipe
- Usar `HandLandmarker` com `runningMode: "VIDEO"`
- Processar em `requestAnimationFrame` para performance
- Usar landmarks 8 (Index Tip) e 4 (Thumb Tip) para detecção
- Aplicar espelhamento horizontal (1 - x) para coordenadas X
- Limpar recursos no cleanup (close landmarker, stop tracks)

### Decisões de Design Importantes

#### Arquitetura de Componentes
- **App.tsx**: Orquestração, UI principal, detecção de gestos
- **useMediaPipe**: Integração MediaPipe, processamento de vídeo
- **CursorOverlay**: Renderização do cursor virtual
- **WebcamPreview**: Preview da webcam com landmarks

#### Fluxo de Dados
- MediaPipe processa frames e atualiza `handDataRef` (ref mutável)
- App.tsx lê `handDataRef` em loop separado e atualiza estado UI
- Componentes recebem props reativas ou refs conforme necessário

#### Performance
- **Refs vs State**: Refs para dados de detecção (evita re-renders)
- **RequestAnimationFrame**: Loop sincronizado com refresh rate (60fps)
- **Suavização (Lerp)**: Interpolação linear para reduzir jitter
- **Cleanup**: Sempre limpar recursos no unmount

#### Gestos
- **Mover cursor**: Posição do dedo indicador (landmark 8)
- **Pinch**: Distância entre indicador e polegar < `PINCH_THRESHOLD`
- **Clique esquerdo**: Pinch único (1x)
- **Clique direito**: Pinch duplo (2x) dentro de `DOUBLE_CLICK_TIMEOUT`

### Anti-Patterns a Evitar

#### Código
- NÃO usar `any` - preferir `unknown` quando necessário
- NÃO colocar lógica de MediaPipe em componentes
- NÃO usar `useState` para dados atualizados em 60fps (usar refs)
- NÃO esquecer cleanup em `useEffect`
- NÃO processar frames fora de `requestAnimationFrame`

#### Performance
- NÃO causar re-renders desnecessários
- NÃO bloquear a thread principal
- NÃO processar frames quando não há mão detectada (otimização futura)

#### UI/UX
- NÃO ocultar feedback visual
- NÃO remover cursor virtual (sempre visível)
- NÃO remover logs de debug (úteis para troubleshooting)

### Segurança e Privacidade

#### Obrigatório
- Processamento 100% local (sem envio de dados)
- Permissão explícita de câmera via `getUserMedia`
- Sem armazenamento de imagens/vídeo
- Sem tracking ou analytics

#### Recomendado
- Validar permissões antes de iniciar câmera
- Tratar erros de câmera com mensagens amigáveis
- Informar usuário sobre uso da câmera

### Performance

#### Otimizações Implementadas
- Suavização de movimento (lerp)
- Processamento assíncrono (requestAnimationFrame)
- Uso de refs para evitar re-renders
- Cleanup adequado de recursos

#### Limitações Conhecidas
- Latência de ~100-200ms (processamento + suavização)
- Consumo de CPU/GPU para processamento de vídeo
- Depende de iluminação adequada
- Requer mão visível na câmera

### Extensibilidade

#### Adicionar Novos Gestos
1. Adicionar tipo em `GestureType` enum
2. Implementar lógica de detecção em `App.tsx` ou `useMediaPipe.ts`
3. Adicionar feedback visual em `CursorOverlay.tsx`
4. Atualizar constantes se necessário

#### Melhorar Precisão
- Ajustar `PINCH_THRESHOLD` em `constants.ts`
- Modificar `MOVEMENT_SMOOTHING` para menos lag ou mais suavidade
- Ajustar confianças do MediaPipe

#### Adicionar Novos Controles
- Scroll: Detectar movimento vertical do dedo
- Drag: Detectar pinch mantido + movimento
- Zoom: Detectar distância entre duas mãos

### Troubleshooting

#### MediaPipe não inicializa
1. Verificar conexão com internet (modelo carregado via CDN)
2. Verificar suporte a WebAssembly
3. Verificar console para erros
4. Verificar se URL do modelo está acessível

#### Câmera não inicia
1. Verificar permissões do navegador
2. Verificar se outra aplicação está usando a câmera
3. Verificar se câmera está funcionando
4. Verificar se HTTPS é necessário (Safari)

#### Performance ruim
1. Reduzir resolução da câmera
2. Aumentar `MOVEMENT_SMOOTHING` (mais lag, menos processamento)
3. Fechar outras aplicações pesadas
4. Verificar se GPU está sendo usada (delegate: "GPU")

#### Gestos não detectados
1. Verificar iluminação
2. Verificar se mão está visível na câmera
3. Ajustar `PINCH_THRESHOLD` se necessário
4. Verificar distância da câmera (30-60cm ideal)

### Documentação Relacionada

- `docs/guia-de-uso.md` - Guia completo para usuários
- `docs/gestos-e-controles.md` - Documentação de gestos
- `docs/arquitetura-tecnica.md` - Documentação técnica completa
- `README.md` - Instalação e configuração

### Convenções Específicas do Projeto

#### Nomenclatura
- Componentes: PascalCase (`CursorOverlay.tsx`)
- Hooks: camelCase com prefixo `use` (`useMediaPipe.ts`)
- Funções: camelCase (`handlePinchRelease`)
- Constantes: UPPER_SNAKE_CASE (`PINCH_THRESHOLD`)
- Types/Interfaces: PascalCase (`GestureType`, `ScreenPoint`)

#### Imports
Ordem recomendada:
1. Bibliotecas externas
2. Componentes locais
3. Hooks locais
4. Types/Interfaces
5. Constantes/Utils

#### Licença
Todos os arquivos devem incluir o cabeçalho:
```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
```
