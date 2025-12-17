# Guia de Uso - Gesture Browser Control

## Introdução

Bem-vindo ao Gesture Browser Control! Este guia irá ajudá-lo a começar a usar a aplicação para controlar o cursor do mouse através de gestos de mão.

## Primeiros Passos

### 1. Acessar a Aplicação

1. Abra o navegador (Chrome, Firefox, Edge ou Safari)
2. Acesse a URL da aplicação
3. Aguarde o carregamento inicial

### 2. Permitir Acesso à Câmera

1. O navegador solicitará permissão para acessar a câmera
2. Clique em "Permitir" ou "Permitir acesso à câmera"
3. Aguarde a inicialização do sistema de visão

### 3. Verificar Status

- **Carregando**: Spinner animado com mensagem "Iniciando sistema de visão..."
- **Pronto**: Interface principal aparece com instruções e área de teste
- **Erro**: Mensagem de erro será exibida (verifique permissões e câmera)

## Interface

### Elementos da Tela

#### Header
- **Título**: "Gesture Browser" com ícone de mouse
- **Subtítulo**: "Controle o mouse via webcam"

#### Card de Instruções (Esquerda)
Contém três seções explicando os comandos:
- **Mover Cursor**: Como mover o cursor
- **Clique Esquerdo**: Como fazer clique esquerdo
- **Clique Direito**: Como fazer clique direito

#### Área de Teste (Direita)
- **Box Interativo**: Área para testar cliques
- **Botão**: Botão que muda de cor ao ser clicado
- **Feedback Visual**: Box muda de cor quando clicado

#### Log de Eventos (Abaixo)
- **Últimos 5 eventos**: Mostra ações detectadas
- **Formato**: "Left Click at (x, y)" ou "Right Click at (x, y)"
- **Atualização**: Atualiza em tempo real

#### Preview da Webcam (Canto Inferior Direito)
- **Tamanho**: 264x192 pixels
- **Conteúdo**: Vídeo da webcam com landmarks desenhados
- **Cores**: 
  - Vermelho: Mão esquerda
  - Azul: Mão direita
- **Destaque**: Dedo indicador destacado em branco

#### Cursor Virtual
- **Sempre visível**: Cursor azul na tela
- **Muda de cor**: 
  - Azul: Normal
  - Vermelho: Pinch ativo
  - Verde: Clique esquerdo
  - Roxo: Clique direito
- **Label**: Mostra ação atual acima do cursor

## Como Usar

### Passo 1: Posicionar-se

1. Sente-se a uma distância confortável da câmera (30-60cm)
2. Certifique-se de que a iluminação está adequada
3. Mantenha a mão visível na câmera

### Passo 2: Mover o Cursor

1. Abra a mão e estenda o dedo indicador
2. Aponte o dedo indicador para a câmera
3. Mova o dedo na direção desejada
4. O cursor azul seguirá o movimento do dedo

**Dicas**:
- Movimentos suaves funcionam melhor
- Mantenha o dedo indicador bem estendido
- Evite movimentos muito rápidos

### Passo 3: Fazer Clique Esquerdo

1. Mova o cursor até o elemento desejado
2. Junte o dedo indicador e o polegar (pinch)
3. Solte os dedos (separe-os)
4. O clique será disparado automaticamente

**Feedback**:
- Cursor fica vermelho durante o pinch
- Cursor fica verde ao clicar
- Log mostra "Left Click at (x, y)"

### Passo 4: Fazer Clique Direito

1. Mova o cursor até o elemento desejado
2. Junte e solte os dedos (primeiro pinch)
3. **Rapidamente** (dentro de 300ms), junte e solte os dedos novamente (segundo pinch)
4. O clique direito será disparado automaticamente

**Feedback**:
- Cursor fica vermelho durante cada pinch
- Cursor fica roxo ao clicar
- Log mostra "Right Click at (x, y)"

## Testando

### Teste Básico

1. Use a área de teste na interface
2. Mova o cursor até o botão "Interaja aqui"
3. Faça um pinch para clicar
4. Observe o botão mudar de cor e a mensagem mudar

### Teste de Clique Direito

1. Mova o cursor até o botão
2. Faça dois pinches rápidos
3. Observe o menu de contexto aparecer (se suportado pelo navegador)

## Dicas e Truques

### Melhor Precisão

- **Iluminação**: Use iluminação frontal uniforme
- **Fundo**: Prefira fundos contrastantes
- **Distância**: Mantenha 30-60cm da câmera
- **Movimento**: Movimentos suaves e controlados

### Evitar Problemas

- **Não oculte a mão**: Mantenha sempre visível na câmera
- **Não mova muito rápido**: Movimentos rápidos podem causar lag
- **Não hesite**: Para clique direito, faça os dois pinches rapidamente
- **Mantenha dedos juntos**: Para pinch, certifique-se de tocar as pontas dos dedos

### Prática

- Pratique movendo o cursor pela tela
- Pratique cliques em diferentes elementos
- Pratique clique direito (requer coordenação)
- Use a área de teste para se familiarizar

## Solução de Problemas

### Cursor não se move

**Sintomas**: Cursor não responde ao movimento da mão

**Soluções**:
1. Verifique se a câmera está funcionando
2. Verifique se a mão está visível na câmera
3. Melhore a iluminação
4. Recarregue a página

### Pinch não é detectado

**Sintomas**: Cursor não fica vermelho ao juntar os dedos

**Soluções**:
1. Certifique-se de tocar as pontas dos dedos
2. Ajuste a distância da câmera
3. Melhore a iluminação
4. Verifique se a mão está bem visível

### Clique direito não funciona

**Sintomas**: Dois pinches são interpretados como dois cliques esquerdos

**Soluções**:
1. Faça os dois pinches mais rapidamente
2. Certifique-se de que ambos os pinches são detectados (cursor fica vermelho)
3. Pratique o movimento

### Cursor muito "tremido"

**Sintomas**: Cursor se move de forma instável

**Soluções**:
1. Movimente-se mais devagar
2. Mantenha iluminação constante
3. Use uma câmera de melhor qualidade se possível
4. Verifique se há vibração na câmera ou mesa

## Limitações Conhecidas

- Apenas uma mão detectada por vez
- Requer mão visível na câmera
- Latência de ~100-200ms
- Precisão depende da qualidade da câmera
- Não suporta scroll ou arrastar (drag)
- Funciona melhor com iluminação adequada

## Próximos Passos

Após se familiarizar com os gestos básicos:

1. Experimente clicar em diferentes elementos da página
2. Teste em diferentes sites e aplicações web
3. Pratique até se sentir confortável
4. Explore funcionalidades avançadas (quando disponíveis)

## Suporte

Se encontrar problemas:

1. Verifique este guia de uso
2. Consulte a documentação técnica
3. Verifique os logs na interface
4. Recarregue a página se necessário

## Feedback

Sua experiência é importante! Se tiver sugestões ou encontrar problemas, considere reportá-los para melhorar a aplicação.

