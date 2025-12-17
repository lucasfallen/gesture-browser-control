# Tarefas - Calibração de Superfície e Grid

## Fase 1: Tipos e Constantes

### TASK-001: Adicionar tipos TypeScript
**Descrição**: Adicionar interfaces e tipos necessários para calibração e grid.

**Arquivos**:
- `types.ts`

**Tarefas**:
- [ ] Adicionar interface `BoundingBox`
- [ ] Adicionar interface `GridBounds`
- [ ] Adicionar interface `CalibrationState`
- [ ] Adicionar tipo `CalibrationMode`
- [ ] Adicionar tipo `TouchType`

**Estimativa**: 15 minutos

---

### TASK-002: Adicionar constantes de configuração
**Descrição**: Adicionar constantes para detecção de superfície, toque e grid.

**Arquivos**:
- `constants.ts`

**Tarefas**:
- [ ] Adicionar `SURFACE_WHITE_THRESHOLD`
- [ ] Adicionar `SURFACE_MIN_SIZE`
- [ ] Adicionar `SURFACE_DETECTION_INTERVAL`
- [ ] Adicionar `TOUCH_Z_THRESHOLD`
- [ ] Adicionar `TOUCH_VELOCITY_THRESHOLD`
- [ ] Adicionar `TOUCH_CONFIRMATION_FRAMES`
- [ ] Adicionar `GRID_MARGIN`

**Estimativa**: 10 minutos

---

## Fase 2: Hooks de Calibração

### TASK-003: Criar hook useSurfaceCalibration
**Descrição**: Implementar hook para detecção de superfície branca e criação de grid.

**Arquivos**:
- `hooks/useSurfaceCalibration.ts` (novo)

**Tarefas**:
- [ ] Criar função de detecção de superfície (threshold + contours)
- [ ] Implementar cálculo de bounding box
- [ ] Implementar validação de tamanho mínimo
- [ ] Implementar criação de GridBounds
- [ ] Implementar mapeamento de coordenadas (superfície → grid → tela)
- [ ] Implementar estados: isCalibrating, isGridMode, gridBounds
- [ ] Implementar métodos: startCalibration, cancelCalibration, confirmCalibration, toggleGridMode

**Estimativa**: 2-3 horas

**Dependências**: TASK-001, TASK-002

---

### TASK-004: Criar hook useTouchDetection
**Descrição**: Implementar hook para detecção de toque do indicador e dedo médio.

**Arquivos**:
- `hooks/useTouchDetection.ts` (novo)

**Tarefas**:
- [ ] Implementar monitoramento de coordenada Z dos landmarks
- [ ] Implementar cálculo de velocidade vertical
- [ ] Implementar detecção de movimento descendente
- [ ] Implementar identificação de dedo (indicador vs médio)
- [ ] Implementar confirmação de toque (múltiplos frames)
- [ ] Implementar estados: isTouching, touchType
- [ ] Implementar callbacks: onTouchStart, onTouchEnd

**Estimativa**: 2 horas

**Dependências**: TASK-001, TASK-002

---

## Fase 3: Componentes de UI

### TASK-005: Criar componente SurfaceCalibrationUI
**Descrição**: Criar interface de usuário para calibração de superfície.

**Arquivos**:
- `components/SurfaceCalibrationUI.tsx` (novo)

**Tarefas**:
- [ ] Criar layout de calibração (instruções, preview, botões)
- [ ] Implementar preview visual da superfície detectada
- [ ] Implementar botão de confirmar
- [ ] Implementar botão de cancelar
- [ ] Adicionar feedback visual durante detecção
- [ ] Adicionar mensagens de erro/validação

**Estimativa**: 1-2 horas

**Dependências**: TASK-003

---

### TASK-006: Criar componente GridOverlay (Opcional)
**Descrição**: Criar componente para visualizar grid na tela (debug/desenvolvimento).

**Arquivos**:
- `components/GridOverlay.tsx` (novo)

**Tarefas**:
- [ ] Criar overlay visual da grid
- [ ] Desenhar bordas da área de trabalho
- [ ] Adicionar toggle para mostrar/ocultar
- [ ] Adicionar indicador quando cursor está fora da grid

**Estimativa**: 30 minutos

**Dependências**: TASK-001, TASK-003

---

## Fase 4: Integração com App.tsx

### TASK-007: Adicionar estados de calibração em App.tsx
**Descrição**: Adicionar estados e lógica para gerenciar modo de calibração e grid.

**Arquivos**:
- `App.tsx`

**Tarefas**:
- [ ] Adicionar estado `calibrationMode`
- [ ] Adicionar estado `gridModeActive`
- [ ] Integrar `useSurfaceCalibration`
- [ ] Integrar `useTouchDetection`
- [ ] Adicionar lógica condicional para modo normal vs grid

**Estimativa**: 30 minutos

**Dependências**: TASK-003, TASK-004

---

### TASK-008: Modificar lógica de movimento do cursor
**Descrição**: Adaptar lógica de movimento para usar grid quando ativo.

**Arquivos**:
- `App.tsx`

**Tarefas**:
- [ ] Modificar loop principal para verificar `gridModeActive`
- [ ] Usar `mapToGrid` quando em modo grid
- [ ] Manter lógica normal quando não em modo grid
- [ ] Garantir que cursor não saia dos limites da grid

**Estimativa**: 45 minutos

**Dependências**: TASK-007

---

### TASK-009: Substituir lógica de clique (modo grid)
**Descrição**: Substituir detecção de pinch por detecção de toque quando em modo grid.

**Arquivos**:
- `App.tsx`

**Tarefas**:
- [ ] Adicionar lógica condicional para detecção de clique
- [ ] Usar `touchDetection` quando em modo grid
- [ ] Manter lógica de pinch quando em modo normal
- [ ] Integrar eventos de toque com `triggerClick`

**Estimativa**: 45 minutos

**Dependências**: TASK-007, TASK-004

---

### TASK-010: Adicionar botão "Change Mode" na UI
**Descrição**: Adicionar interface para alternar entre modos.

**Arquivos**:
- `App.tsx`

**Tarefas**:
- [ ] Adicionar botão "Change Mode" na interface
- [ ] Implementar menu/dropdown para selecionar modo
- [ ] Adicionar indicador visual do modo ativo
- [ ] Integrar com `SurfaceCalibrationUI` quando em modo calibração

**Estimativa**: 30 minutos

**Dependências**: TASK-005, TASK-007

---

## Fase 5: Melhorias no useMediaPipe

### TASK-011: Expor coordenadas Z dos landmarks
**Descrição**: Modificar useMediaPipe para expor coordenada Z (profundidade) dos landmarks.

**Arquivos**:
- `hooks/useMediaPipe.ts`
- `types.ts`

**Tarefas**:
- [ ] Adicionar coordenada Z ao tipo `HandData` (ou criar novo tipo)
- [ ] Modificar `processResults` para incluir coordenada Z
- [ ] Garantir compatibilidade com código existente
- [ ] Documentar disponibilidade de Z (pode variar)

**Estimativa**: 30 minutos

**Dependências**: TASK-001

---

### TASK-012: Adicionar método para capturar frame
**Descrição**: Adicionar método para obter frame atual do vídeo para processamento de calibração.

**Arquivos**:
- `hooks/useMediaPipe.ts`

**Tarefas**:
- [ ] Criar função `getCurrentFrame()` que retorna canvas com frame atual
- [ ] Garantir que frame está sincronizado com vídeo
- [ ] Otimizar para não impactar performance

**Estimativa**: 20 minutos

**Dependências**: TASK-003

---

## Fase 6: Testes e Ajustes

### TASK-013: Testar fluxo completo de calibração
**Descrição**: Testar end-to-end o processo de calibração.

**Tarefas**:
- [ ] Testar detecção de superfície em diferentes condições
- [ ] Testar confirmação e criação de grid
- [ ] Testar cancelamento de calibração
- [ ] Verificar persistência durante sessão
- [ ] Testar recalibração

**Estimativa**: 1 hora

**Dependências**: Todas as tarefas anteriores

---

### TASK-014: Testar mapeamento e movimento do cursor
**Descrição**: Testar precisão do mapeamento de coordenadas.

**Tarefas**:
- [ ] Testar movimento do cursor dentro da grid
- [ ] Verificar limites da grid
- [ ] Testar precisão do mapeamento
- [ ] Verificar suavização do movimento

**Estimativa**: 30 minutos

**Dependências**: TASK-008

---

### TASK-015: Testar detecção de toque
**Descrição**: Testar detecção de toque do indicador e dedo médio.

**Tarefas**:
- [ ] Testar toque do indicador (clique esquerdo)
- [ ] Testar toque do dedo médio (clique direito)
- [ ] Verificar taxa de falsos positivos
- [ ] Ajustar thresholds se necessário

**Estimativa**: 1 hora

**Dependências**: TASK-009, TASK-011

---

### TASK-016: Ajustar thresholds e constantes
**Descrição**: Ajustar valores de configuração baseado em testes.

**Arquivos**:
- `constants.ts`

**Tarefas**:
- [ ] Ajustar `TOUCH_Z_THRESHOLD` baseado em testes
- [ ] Ajustar `TOUCH_VELOCITY_THRESHOLD` baseado em testes
- [ ] Ajustar `SURFACE_WHITE_THRESHOLD` baseado em testes
- [ ] Documentar valores recomendados

**Estimativa**: 30 minutos

**Dependências**: TASK-013, TASK-014, TASK-015

---

## Fase 7: Documentação e Finalização

### TASK-017: Atualizar documentação
**Descrição**: Atualizar documentação do projeto com nova funcionalidade.

**Arquivos**:
- `docs/gestos-e-controles.md`
- `docs/arquitetura-tecnica.md`
- `README.md`

**Tarefas**:
- [ ] Documentar modo de calibração
- [ ] Documentar modo grid
- [ ] Documentar novos gestos (toque indicador/médio)
- [ ] Atualizar diagramas de arquitetura
- [ ] Adicionar screenshots/exemplos

**Estimativa**: 1 hora

**Dependências**: Todas as tarefas anteriores

---

### TASK-018: Verificação final e cleanup
**Descrição**: Verificação final do código, cleanup e otimizações.

**Tarefas**:
- [ ] Revisar código para garantir compatibilidade
- [ ] Remover código de debug/comentários desnecessários
- [ ] Verificar que modo normal ainda funciona
- [ ] Verificar performance geral
- [ ] Testar em diferentes navegadores

**Estimativa**: 1 hora

**Dependências**: Todas as tarefas anteriores

---

## Resumo de Estimativas

- **Fase 1 (Tipos e Constantes)**: ~25 minutos
- **Fase 2 (Hooks)**: ~4-5 horas
- **Fase 3 (Componentes UI)**: ~1.5-2.5 horas
- **Fase 4 (Integração App.tsx)**: ~2.5 horas
- **Fase 5 (Melhorias useMediaPipe)**: ~50 minutos
- **Fase 6 (Testes)**: ~2.5 horas
- **Fase 7 (Documentação)**: ~2 horas

**Total Estimado**: ~14-16 horas

## Ordem de Execução Recomendada

1. TASK-001, TASK-002 (Tipos e Constantes)
2. TASK-011, TASK-012 (Melhorias useMediaPipe)
3. TASK-003 (useSurfaceCalibration)
4. TASK-004 (useTouchDetection)
5. TASK-005 (SurfaceCalibrationUI)
6. TASK-007, TASK-008, TASK-009 (Integração App.tsx)
7. TASK-010 (Botão Change Mode)
8. TASK-006 (GridOverlay - opcional)
9. TASK-013, TASK-014, TASK-015 (Testes)
10. TASK-016 (Ajustes)
11. TASK-017, TASK-018 (Documentação e Finalização)

