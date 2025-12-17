# Adicionar Nova Feature

## Descricao
Adiciona uma nova funcionalidade a Intranet Corporativa, garantindo que o agente compreenda a arquitetura atual e mantenha consistencia com o codigo existente.

## Instrucoes

### 1. Contexto Obrigatorio
Antes de qualquer acao, leia e compreenda:
- `@.cursor/rules/architecture.md` - Estrutura atual do backend
- `@.cursor/rules/tech-stack.md` - Tecnologias utilizadas
- `@.cursor/rules/product.md` - Funcionalidades implementadas
- `@docs/INTRANET.md` - Especificacao funcional da aplicacao

### 2. Analise de Impacto
Identifique quais partes do codigo serao afetadas:
- [ ] Controllers (src/controllers/)
- [ ] Services (src/services/)
- [ ] Routes (src/routes/)
- [ ] Types/interfaces (src/types/)
- [ ] Prisma Schema (prisma/schema.prisma)
- [ ] WebSocket (src/websocket/)

### 3. Planejamento
Apresente um plano detalhado incluindo:
1. **O que sera criado** (novos arquivos/componentes)
2. **O que sera modificado** (arquivos existentes)
3. **Integracao** (como se conecta com a arquitetura atual)
4. **Riscos** (possiveis quebras ou side effects)

### 4. Aprovacao
**SOLICITE APROVACAO** explicita do usuario antes de implementar.

### 5. Implementacao
Execute seguindo os padroes de `@.cursor/rules/structure.md`:
- Controllers em `src/controllers/`
- Services em `src/services/`
- Routes em `src/routes/`
- Types em `src/types/`
- Utils em `src/utils/`

### 6. Verificacao
Apos implementar:
- Verifique lints (`read_lints`)
- Teste a API se possivel
- Documente mudancas significativas

### 7. Atualizacao de Docs
Se a feature for significativa, sugira atualizacoes para:
- `architecture.md` (novos controllers/services)
- `product.md` (novas funcionalidades)
- `INTRANET.md` (novos fluxos)

