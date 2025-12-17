# Documentação - Gesture Browser Control

Bem-vindo à documentação do projeto Gesture Browser Control. Esta pasta contém toda a documentação sobre a aplicação, suas funcionalidades e uso.

## Documentos Disponíveis

### Para Usuários

- **[Guia de Uso](./guia-de-uso.md)**: Guia completo para começar a usar a aplicação
  - Primeiros passos
  - Como usar cada funcionalidade
  - Dicas e truques
  - Solução de problemas

- **[Gestos e Controles](./gestos-e-controles.md)**: Documentação detalhada sobre todos os gestos suportados
  - Mover cursor
  - Pinch (juntar dedos)
  - Clique esquerdo
  - Clique direito
  - Troubleshooting

### Para Desenvolvedores

- **[Arquitetura Técnica](./arquitetura-tecnica.md)**: Documentação técnica completa
  - Stack tecnológica
  - Arquitetura de componentes
  - Fluxo de dados
  - Decisões de design
  - Extensibilidade

## Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo (índice)
├── guia-de-uso.md              # Guia para usuários
├── gestos-e-controles.md       # Documentação de gestos
├── arquitetura-tecnica.md      # Documentação técnica
└── webcamgests.md              # Documentação legada (manter para referência)
```

## Início Rápido

### Para Usuários

1. Leia o [Guia de Uso](./guia-de-uso.md) para começar
2. Consulte [Gestos e Controles](./gestos-e-controles.md) para aprender os gestos
3. Pratique na área de teste da aplicação

### Para Desenvolvedores

1. Leia a [Arquitetura Técnica](./arquitetura-tecnica.md) para entender o sistema
2. Consulte `.cursor/rules/` para padrões de código
3. Veja o código-fonte para exemplos práticos

## Links Úteis

- **Código-fonte**: Ver arquivos na raiz do projeto
- **Regras do Cursor**: `.cursor/rules/`
- **Configurações**: `vite.config.ts`, `tsconfig.json`
- **Constantes**: `constants.ts`
- **Types**: `types.ts`

## Contribuindo

Ao adicionar novas funcionalidades:

1. Atualize a documentação relevante
2. Adicione exemplos de uso
3. Documente limitações conhecidas
4. Atualize este README se necessário

## Manutenção

Esta documentação deve ser mantida atualizada com o código. Sempre que houver mudanças significativas:

- Atualize os documentos afetados
- Adicione notas de versão se necessário
- Mantenha exemplos atualizados

