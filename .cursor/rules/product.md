# Produto: Gesture Browser Control

## Visão Geral

Aplicação web que permite controlar o cursor do mouse através de gestos de mão capturados pela webcam, utilizando tecnologia de visão computacional (MediaPipe) para detecção em tempo real.

## Objetivo

Proporcionar uma forma alternativa e acessível de interação com interfaces web, especialmente útil para:
- Apresentações e demonstrações
- Ambientes onde o mouse físico não está disponível
- Experiências interativas e imersivas
- Acessibilidade para usuários com limitações motoras

## Funcionalidades Principais

### 1. Controle de Cursor

**Descrição**: Move o cursor virtual na tela seguindo o movimento do dedo indicador.

**Como funciona**:
- MediaPipe detecta o landmark 8 (ponta do dedo indicador)
- Coordenadas normalizadas (0-1) são convertidas para pixels da tela
- Aplicado espelhamento horizontal (mover mão direita → cursor vai para direita)
- Suavização aplicada para reduzir jitter

**Características**:
- Movimento suave com interpolação linear
- Feedback visual em tempo real
- Cursor sempre visível na tela

### 2. Detecção de Pinch

**Descrição**: Detecta quando o usuário junta o dedo indicador e o polegar.

**Como funciona**:
- Calcula distância euclidiana entre landmarks 4 (polegar) e 8 (indicador)
- Se distância < `PINCH_THRESHOLD` (0.05 normalizado) → pinch detectado
- Estado mantido enquanto distância permanece abaixo do threshold

**Feedback visual**:
- Cursor muda de cor (azul → vermelho)
- Cursor aumenta de tamanho
- Label "Pinch..." exibida

### 3. Clique Esquerdo

**Descrição**: Simula clique esquerdo do mouse ao soltar um pinch único.

**Como funciona**:
1. Usuário faz pinch (junta dedos)
2. Usuário solta pinch
3. Sistema detecta "rising edge" (pinch → não pinch)
4. Se apenas 1 pinch dentro de `DOUBLE_CLICK_TIMEOUT` (300ms) → clique esquerdo
5. Dispara `element.click()` no elemento sob o cursor

**Feedback visual**:
- Cursor muda para verde
- Animação de pulse
- Label "Left Click" exibida
- Log adicionado ao sistema

### 4. Clique Direito

**Descrição**: Simula clique direito do mouse ao fazer dois pinches rápidos.

**Como funciona**:
1. Usuário faz pinch e solta (primeiro)
2. Dentro de 300ms, faz outro pinch e solta (segundo)
3. Sistema detecta 2+ pinches → clique direito
4. Dispara `contextmenu` event no elemento sob o cursor

**Feedback visual**:
- Cursor muda para roxo
- Animação de pulse
- Label "Right Click" exibida
- Log adicionado ao sistema

## Interface do Usuário

### Tela Principal

**Header**:
- Título "Gesture Browser" com ícone
- Subtítulo "Controle o mouse via webcam"

**Estado de Carregamento**:
- Spinner animado
- Mensagem "Iniciando sistema de visão..."
- Exibe erros se houver

**Interface Principal** (quando câmera pronta):

**Card de Instruções**:
- Seção "Comandos" com ícones
- Instruções visuais para cada gesto:
  - Mover Cursor: Mova o dedo indicador
  - Clique Esquerdo: Junte indicador e dedão 1x
  - Clique Direito: Junte indicador e dedão 2x rapidamente

**Área de Teste**:
- Box interativo para testar cliques
- Botão que muda de cor ao ser clicado
- Feedback visual imediato

**Log de Eventos**:
- Últimos 5 eventos registrados
- Formato: "Left Click at (x, y)" ou "Right Click at (x, y)"
- Estilo monospace para legibilidade

### Componentes Visuais

**Cursor Virtual**:
- Anel externo (30-40px, dependendo do estado)
- Ponto interno (10px)
- Cores dinâmicas:
  - Azul: Estado normal
  - Vermelho: Pinch ativo
  - Verde: Clique esquerdo detectado
  - Roxo: Clique direito detectado
- Animação de pulse em cliques
- Label de ação acima do cursor

**Preview da Webcam**:
- Canto inferior direito (264x192px)
- Overlay com borda azul
- Canvas mostrando:
  - Vídeo espelhado (opacidade 0.8)
  - Landmarks da mão (pontos e conexões)
  - Destaque no dedo indicador (ponto branco maior)
  - Cores: Vermelho (mão esquerda) / Azul (mão direita)

## Fluxo de Uso

### 1. Inicialização

1. Usuário acessa a aplicação
2. Permissão de câmera solicitada
3. MediaPipe carrega modelos (via CDN)
4. Câmera inicia
5. Interface fica disponível

### 2. Uso Básico

1. **Mover cursor**: Mover dedo indicador pela tela
2. **Clicar**: Fazer pinch (juntar dedos) e soltar
3. **Clique direito**: Fazer 2 pinches rápidos
4. **Testar**: Interagir com botão de teste na interface

### 3. Feedback

- Cursor visual sempre visível
- Mudanças de cor indicam estado
- Logs mostram ações detectadas
- Preview da webcam mostra detecção

## Limitações Conhecidas

### Técnicas
- Requer iluminação adequada
- Mão deve estar visível na câmera
- Latência de ~100-200ms
- Precisão depende da qualidade da câmera
- Funciona melhor com fundo contrastante

### Funcionalidades
- Apenas uma mão detectada por vez
- Sem suporte a scroll/arrastar
- Sem suporte a gestos complexos
- Sem persistência de configurações

## Casos de Uso

### Apresentações
- Controlar slides sem mouse físico
- Interagir com elementos na tela durante apresentação
- Demonstrações interativas

### Acessibilidade
- Usuários com limitações motoras
- Alternativa ao mouse tradicional
- Controle via gestos naturais

### Experiências Interativas
- Kiosques e totens
- Instalações artísticas
- Demonstrações de tecnologia

## Roadmap (Backlog)

### Prioridade Alta
- [ ] Melhorar precisão de detecção
- [ ] Reduzir latência
- [ ] Adicionar configurações ajustáveis (thresholds, suavização)

### Prioridade Média
- [ ] Suporte a scroll (movimento vertical)
- [ ] Suporte a drag (pinch + movimento)
- [ ] Persistência de preferências
- [ ] Modo de calibração

### Prioridade Baixa
- [ ] Suporte a múltiplas mãos
- [ ] Gestos customizáveis
- [ ] Histórico de gestos
- [ ] Exportação de logs

## Métricas de Sucesso

- Precisão de detecção de pinch (>95%)
- Latência de movimento (<200ms)
- Taxa de falsos positivos (<5%)
- Usabilidade (feedback positivo dos usuários)
