# Revisar Projeto e Propor Refatoracoes

## Descricao

Realiza uma revisao completa da aplicacao para identificar problemas de arquitetura, design ruim, inconsistencias e oportunidades de melhoria. Gera specs de refatoracao organizadas no diretorio `.refactor/`.

## Instrucoes

### 1. Contexto Obrigatorio

Antes de revisar, leia e compreenda:
- `@.cursor/rules/architecture.md` - Arquitetura esperada
- `@.cursor/rules/structure.md` - Estrutura e convencoes
- `@.cursor/rules/coding-style.md` - Padroes de codigo
- `@docs/INTRANET.md` - Especificacao funcional

### 2. Analise do Projeto

Examine o projeto em busca de:

#### Problemas de Arquitetura
- [ ] Controllers com logica de negocio (deveria estar em services)
- [ ] Services acessando req/res diretamente
- [ ] Duplicacao de codigo entre controllers/services
- [ ] Dependencias circulares
- [ ] Acoplamento excessivo entre modulos

#### Problemas de Design
- [ ] Funcoes muito grandes (>50 linhas)
- [ ] Arquivos muito grandes (>300 linhas)
- [ ] Nomes inconsistentes ou pouco descritivos
- [ ] Falta de tipagem TypeScript
- [ ] Tratamento de erros inconsistente

#### Inconsistencias de Padrao
- [ ] Endpoints fora do padrao REST
- [ ] Respostas de API com formatos diferentes
- [ ] Imports desorganizados
- [ ] Formatacao inconsistente
- [ ] Falta de validacao de entrada

#### Codigo Legado/Desnecessario
- [ ] Imports nao utilizados
- [ ] Funcoes nunca chamadas
- [ ] Codigo comentado
- [ ] Arquivos orfaos
- [ ] Dependencias nao utilizadas

### 3. Criar Estrutura de Refatoracao

Crie o diretorio `.refactor/` na raiz do projeto com a seguinte estrutura:

```
.refactor/
├── README.md              # Visao geral dos problemas encontrados
├── priority-high/         # Refatoracoes urgentes
│   └── [nome-issue]/
│       ├── problem.md     # Descricao do problema
│       ├── solution.md    # Solucao proposta
│       └── tasks.md       # Tarefas de implementacao
├── priority-medium/       # Refatoracoes importantes
│   └── [nome-issue]/
│       └── ...
└── priority-low/          # Melhorias opcionais
    └── [nome-issue]/
        └── ...
```

### 4. Documentar Problemas Encontrados

Para cada problema identificado, crie uma pasta em `.refactor/[prioridade]/[nome-issue]/`:

#### `problem.md`
```markdown
# [Titulo do Problema]

## Descricao
[O que esta errado e por que e um problema]

## Localizacao
- Arquivos afetados: [lista de arquivos]
- Linhas aproximadas: [se aplicavel]

## Impacto
- [ ] Afeta performance
- [ ] Afeta manutencao
- [ ] Afeta escalabilidade
- [ ] Cria divida tecnica

## Exemplos
[Codigo atual mostrando o problema]
```

#### `solution.md`
```markdown
# Solucao Proposta

## Abordagem
[Como resolver o problema]

## Mudancas Necessarias
1. [Mudanca 1]
2. [Mudanca 2]

## Riscos
- [Risco potencial e mitigacao]

## Codigo Proposto
[Exemplo de como ficaria apos refatoracao]
```

#### `tasks.md`
```markdown
# Tarefas de Refatoracao

## Pre-requisitos
- [ ] [Dependencias para iniciar]

## Implementacao
- [ ] REFACTOR-001: [Tarefa 1]
- [ ] REFACTOR-002: [Tarefa 2]

## Verificacao
- [ ] Testes passando
- [ ] Lints corrigidos
- [ ] Funcionalidade preservada
```

### 5. Criar README Principal

Crie `.refactor/README.md` com visao geral:

```markdown
# Plano de Refatoracao - Intranet Backend

## Data da Revisao
[Data atual]

## Resumo Executivo
[Breve descricao do estado do projeto]

## Problemas por Prioridade

### Alta Prioridade (X issues)
| Issue | Descricao | Esforco |
|-------|-----------|---------|
| [nome] | [desc] | [baixo/medio/alto] |

### Media Prioridade (X issues)
...

### Baixa Prioridade (X issues)
...

## Recomendacoes
1. [Recomendacao principal]
2. [Proximos passos]

## Metricas Atuais
- Total de arquivos analisados: X
- Problemas encontrados: X
- Divida tecnica estimada: [horas/dias]

## Concluidas
| Issue | Data | Descricao |
|-------|------|-----------|
| - | - | Nenhuma refatoracao concluida ainda |
```

### 6. Categorias de Prioridade

Use estes criterios para priorizar:

| Prioridade | Criterio |
|------------|----------|
| **Alta** | Bugs potenciais, falhas de seguranca, bloqueadores de desenvolvimento |
| **Media** | Divida tecnica significativa, performance, manutencao dificil |
| **Baixa** | Melhorias de legibilidade, padronizacao estetica, otimizacoes menores |

### 7. Relatorio para o Usuario

Apresente um resumo estruturado:

```
## Revisao do Projeto Concluida

### Estatisticas
- Arquivos analisados: X
- Problemas encontrados: X (Alta: X, Media: X, Baixa: X)

### Top 3 Problemas Criticos
1. [Problema mais grave]
2. [Segundo mais grave]
3. [Terceiro mais grave]

### Estrutura Criada
.refactor/
├── README.md
├── priority-high/ (X issues)
├── priority-medium/ (X issues)
└── priority-low/ (X issues)

### Proximos Passos Recomendados
1. Revisar specs em `.refactor/priority-high/`
2. Aprovar refatoracoes prioritarias
3. Usar `/refactor` para executar tasks
```

### 8. Solicitar Aprovacao

**AGUARDE APROVACAO** do usuario antes de:
- Iniciar qualquer refatoracao
- Modificar codigo existente

Informe que o usuario pode:
- Revisar cada spec individualmente
- Ajustar prioridades
- Descartar issues que nao considera relevantes
- Usar `/refactor` para executar as tasks aprovadas

### 9. Boas Praticas

- Nao proponha reescritas completas sem necessidade
- Prefira refatoracoes incrementais
- Mantenha compatibilidade com codigo existente
- Documente breaking changes quando inevitaveis
- Considere o esforco vs beneficio de cada mudanca

