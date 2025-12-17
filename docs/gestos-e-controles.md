# Gestos e Controles - Gesture Browser Control

## Visão Geral

Este documento descreve todos os gestos suportados pela aplicação e como utilizá-los para controlar o cursor do mouse.

## Requisitos

- Webcam conectada e funcionando
- Permissão de câmera concedida
- Iluminação adequada
- Mão visível na câmera

## Gestos Suportados

### 1. Mover Cursor

**Descrição**: Move o cursor virtual na tela seguindo o movimento do dedo indicador.

**Como fazer**:
1. Mantenha a mão aberta
2. Aponte o dedo indicador para a câmera
3. Mova o dedo indicador na direção desejada
4. O cursor seguirá o movimento do dedo

**Características**:
- Movimento suave com interpolação linear
- Espelhamento horizontal (mover mão direita → cursor vai para direita)
- Feedback visual em tempo real
- Cursor sempre visível na tela

**Dicas**:
- Mantenha o dedo indicador bem estendido
- Evite movimentos muito rápidos (podem causar lag)
- Mantenha a mão dentro do campo de visão da câmera

### 2. Pinch (Juntar Dedos)

**Descrição**: Junta o dedo indicador e o polegar para ativar o modo "pinch".

**Como fazer**:
1. Com a mão aberta, aproxime o dedo indicador e o polegar
2. Toque a ponta do indicador com a ponta do polegar
3. Mantenha os dedos juntos para manter o pinch ativo

**Feedback visual**:
- Cursor muda de azul para vermelho
- Cursor aumenta de tamanho (30px → 40px)
- Label "Pinch..." aparece acima do cursor

**Uso**:
- Pinch é o gesto base para cliques
- Não solte imediatamente após juntar os dedos
- Mantenha os dedos juntos por um breve momento

### 3. Clique Esquerdo

**Descrição**: Simula um clique esquerdo do mouse.

**Como fazer**:
1. Mova o cursor para o elemento desejado
2. Faça um pinch (junte indicador e polegar)
3. Solte o pinch (separe os dedos)
4. O clique será disparado automaticamente

**Feedback visual**:
- Cursor muda para verde
- Animação de pulse
- Label "Left Click" aparece
- Log registrado: "Left Click at (x, y)"

**Tempo**:
- O sistema espera 300ms após soltar o pinch
- Se não houver segundo pinch nesse tempo, dispara clique esquerdo

**Dicas**:
- Faça o movimento de forma natural
- Não precisa ser muito rápido
- Certifique-se de que o cursor está sobre o elemento antes de soltar

### 4. Clique Direito

**Descrição**: Simula um clique direito do mouse (menu de contexto).

**Como fazer**:
1. Mova o cursor para o elemento desejado
2. Faça um pinch e solte (primeiro)
3. **Rapidamente** (dentro de 300ms), faça outro pinch e solte (segundo)
4. O clique direito será disparado automaticamente

**Feedback visual**:
- Cursor muda para roxo
- Animação de pulse
- Label "Right Click" aparece
- Log registrado: "Right Click at (x, y)"

**Tempo crítico**:
- Os dois pinches devem ocorrer dentro de 300ms
- Se passar mais tempo, será interpretado como dois cliques esquerdos

**Dicas**:
- Pratique o movimento rápido
- Os dois pinches devem ser bem definidos
- Não hesite entre os pinches

## Sequência de Gestos

### Exemplo: Clicar em um Botão

1. **Mover**: Aponte o dedo indicador e mova até o botão
2. **Pinch**: Junte indicador e polegar sobre o botão
3. **Soltar**: Separe os dedos
4. **Resultado**: Botão é clicado

### Exemplo: Menu de Contexto

1. **Mover**: Aponte o dedo indicador e mova até o elemento
2. **Pinch 1**: Junte e solte os dedos (primeiro)
3. **Pinch 2**: Rapidamente, junte e solte os dedos novamente (segundo)
4. **Resultado**: Menu de contexto é aberto

## Troubleshooting

### Cursor não se move

**Possíveis causas**:
- Mão não está visível na câmera
- Iluminação insuficiente
- Câmera não inicializada

**Soluções**:
- Verifique se a câmera está funcionando
- Melhore a iluminação do ambiente
- Recarregue a página

### Pinch não é detectado

**Possíveis causas**:
- Dedos não estão suficientemente juntos
- Mão muito longe ou muito perto da câmera
- Iluminação inadequada

**Soluções**:
- Certifique-se de tocar as pontas dos dedos
- Ajuste a distância da câmera (30-60cm ideal)
- Melhore a iluminação

### Clique direito não funciona

**Possíveis causas**:
- Pinches muito lentos (mais de 300ms entre eles)
- Pinches não estão sendo detectados corretamente

**Soluções**:
- Pratique fazer os dois pinches rapidamente
- Certifique-se de que ambos os pinches são detectados (cursor fica vermelho)

### Cursor muito "tremido"

**Possíveis causas**:
- Movimentos muito rápidos
- Iluminação variável
- Câmera de baixa qualidade

**Soluções**:
- Movimente-se mais devagar
- Mantenha iluminação constante
- Use uma câmera de melhor qualidade se possível

## Configurações Técnicas

### Thresholds (Valores Padrão)

- **PINCH_THRESHOLD**: 0.05 (distância normalizada entre dedos)
- **DOUBLE_CLICK_TIMEOUT**: 300ms (tempo para detectar clique duplo)
- **MOVEMENT_SMOOTHING**: 0.15 (fator de suavização, 0-1)

### Ajustes Recomendados

Se você tiver dificuldades:

- **Pinch muito sensível**: Aumente `PINCH_THRESHOLD` (ex: 0.06)
- **Pinch pouco sensível**: Diminua `PINCH_THRESHOLD` (ex: 0.04)
- **Movimento muito lento**: Aumente `MOVEMENT_SMOOTHING` (ex: 0.25)
- **Movimento muito tremido**: Diminua `MOVEMENT_SMOOTHING` (ex: 0.10)
- **Clique direito difícil**: Aumente `DOUBLE_CLICK_TIMEOUT` (ex: 400ms)

*Nota: Esses valores estão em `constants.ts` e podem ser ajustados no código.*

## Boas Práticas

1. **Posicionamento**: Sente-se a uma distância confortável da câmera (30-60cm)
2. **Iluminação**: Use iluminação frontal uniforme
3. **Fundo**: Prefira fundos contrastantes (evite fundos muito similares à cor da pele)
4. **Movimento**: Movimentos suaves e controlados funcionam melhor
5. **Prática**: Pratique os gestos antes de usar em situações importantes

## Limitações

- Apenas uma mão detectada por vez
- Requer mão visível na câmera
- Latência de ~100-200ms
- Precisão depende da qualidade da câmera e iluminação
- Não suporta scroll ou arrastar (drag)

## Próximos Gestos (Roadmap)

- Scroll vertical (movimento do dedo para cima/baixo)
- Drag (manter pinch e mover)
- Zoom (distância entre duas mãos)
- Gestos customizáveis

