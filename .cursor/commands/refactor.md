# Executar Refatoracao

## Descricao

Executa as tasks de uma spec de refatoracao criada pelo comando `/review-project`. Foco em correcoes, limpeza de codigo legado e aplicacao dos principios DRY, KISS e YAGNI, mantendo a integridade da aplicacao.

## Principios Guia

### DRY (Don't Repeat Yourself)
- Eliminar duplicacao de codigo
- Extrair funcoes/metodos reutilizaveis
- Centralizar configuracoes e constantes

### KISS (Keep It Simple, Stupid)
- Preferir solucoes simples sobre complexas
- Evitar over-engineering
- Codigo legivel > codigo "esperto"

### YAGNI (You Aren't Gonna Need It)
- Remover codigo nao utilizado
- Nao adicionar funcionalidades "por precaucao"
- Eliminar abstracoes desnecessarias

## Instrucoes

### 1. Contexto Obrigatorio

Antes de refatorar, leia:
- `@.cursor/rules/architecture.md` - Arquitetura esperada
- `@.cursor/rules/structure.md` - Convencoes de codigo
- `@.cursor/rules/coding-style.md` - Padroes de estilo
- `@.refactor/README.md` - Visao geral dos problemas

### 2. Identificar Spec de Refatoracao

O usuario informara qual spec executar. Localize em:
- `.refactor/priority-high/[nome-issue]/`
- `.refactor/priority-medium/[nome-issue]/`
- `.refactor/priority-low/[nome-issue]/`

Leia os arquivos:
- `problem.md` - Entender o problema
- `solution.md` - Entender a solucao proposta
- `tasks.md` - Lista de tarefas a executar

### 3. Identificar Proxima Task

Analise o arquivo `tasks.md`:
- Localize a proxima tarefa marcada como `[ ]` (PENDING)
- Ignore tarefas ja marcadas como `[x]` (CONCLUIDA)

### 4. Verificacao Pre-Refatoracao

Antes de modificar qualquer codigo:
- [ ] Identificar todos os arquivos que serao afetados
- [ ] Verificar se ha testes existentes
- [ ] Mapear dependencias do codigo a ser alterado
- [ ] Confirmar que a funcionalidade atual esta funcionando

### 5. Plano de Acao

EXPLIQUE detalhadamente o que sera feito:

```
## Task: [ID da task]

### Arquivos Afetados
- [arquivo1] - [tipo de mudanca]
- [arquivo2] - [tipo de mudanca]

### Mudancas Planejadas
1. [Descricao da mudanca 1]
2. [Descricao da mudanca 2]

### Principios Aplicados
- [ ] DRY: [como sera aplicado]
- [ ] KISS: [como sera aplicado]
- [ ] YAGNI: [como sera aplicado]

### Verificacao de Integridade
- [ ] Funcionalidade preservada
- [ ] Sem breaking changes
- [ ] Tipos TypeScript corretos
```

### 6. Solicitar Aprovacao

**AGUARDE APROVACAO EXPLICITA** do usuario antes de modificar codigo.
Nao prossiga sem confirmacao.

### 7. Executar Refatoracao

Apos aprovacao, execute seguindo estas regras:

#### Remocao de Codigo
- Remover imports nao utilizados
- Deletar funcoes/variaveis orfas
- Eliminar codigo comentado (>30 dias ou sem contexto)
- Remover arquivos nao referenciados

#### Consolidacao (DRY)
- Extrair codigo duplicado para funcoes utilitarias
- Criar helpers para padroes repetidos
- Centralizar constantes em arquivos dedicados

#### Simplificacao (KISS)
- Reduzir niveis de aninhamento
- Simplificar condicionais complexas
- Preferir early returns
- Usar nomes descritivos

#### Limpeza (YAGNI)
- Remover parametros nao utilizados
- Eliminar features nao implementadas
- Remover abstracoes sem uso real

### 8. Preservar Integridade

Durante a refatoracao:
- NAO alterar comportamento externo (API responses)
- NAO modificar assinaturas de funcoes publicas sem necessidade
- NAO remover validacoes de seguranca
- NAO quebrar compatibilidade com frontend

Se breaking changes forem inevitaveis:
- Documentar claramente
- Solicitar aprovacao especifica
- Sugerir estrategia de migracao

### 9. Verificacao Pos-Refatoracao

Apos cada task:
- [ ] Executar `read_lints` nos arquivos alterados
- [ ] Corrigir erros de lint
- [ ] Verificar que imports estao corretos
- [ ] Confirmar que tipos TypeScript estao validos

### 10. Atualizar Status

**CRITICO:** Marque a tarefa como concluida no `tasks.md`:
- Mude `[ ]` para `[x]`
- Adicione data de conclusao

### 11. Documentar Mudancas

Para cada task concluida, adicione ao final do `solution.md`:

```markdown
## Changelog

### [Data] - REFACTOR-XXX
- [O que foi feito]
- Arquivos alterados: [lista]
- Linhas removidas: ~X
- Linhas adicionadas: ~Y
```

### 12. Proxima Task

Pergunte ao usuario:
> "Task de refatoracao concluida. Deseja aprovar o plano para a proxima task?"

Repita o processo ate todas as tasks estarem concluidas.

### 13. Finalizacao da Spec

Quando todas as tasks de uma spec estiverem concluidas:

1. Atualize `.refactor/README.md`:
   - Mova a issue para secao "Concluidas"
   - Adicione data de conclusao

2. Sugira atualizacoes para:
   - `architecture.md` (se houve mudanca estrutural)
   - `coding-style.md` (se novo padrao foi estabelecido)

3. Proponha mensagem de commit:
   ```
   refactor([escopo]): [descricao curta]
   
   - [mudanca 1]
   - [mudanca 2]
   
   Closes: REFACTOR-XXX
   ```

### 14. Metricas de Sucesso

Ao final, reporte:
- Linhas de codigo removidas
- Duplicacoes eliminadas
- Arquivos consolidados/removidos
- Complexidade reduzida (se mensuravel)

## Checklist de Seguranca

Antes de considerar a refatoracao completa:
- [ ] Nenhum endpoint quebrado
- [ ] Nenhuma funcionalidade removida acidentalmente
- [ ] Todos os tipos TypeScript validos
- [ ] Nenhum erro de lint
- [ ] Codigo mais simples que antes

