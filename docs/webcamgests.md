# Intranet Corporativa Gamificada: Especificação Funcional

## 1. Visão Geral
Uma plataforma centralizada de comunicação interna e gestão de conhecimento, integrada ao ecossistema Microsoft. O sistema combina funcionalidades operacionais (documentos, sistemas) com um motor de **Engajamento Social** e **Gamificação**. O objetivo é aumentar a retenção de informação e fortalecer a cultura organizacional através de perfis interativos e recompensas por uso.

## 2. Estrutura do Usuário (Perfil & Integração)

Cada colaborador (Usuário) possui uma identidade digital vinculada e estendida:

### A. Integração Microsoft (SSO)
* **Definição:** A base de autenticação e dados primários.
* **Dados Sincronizados:** Nome, E-mail, Cargo e Departamento.
* **Foto:** Importada da Microsoft, mas editável dentro da plataforma.

### B. Dados Complementares (User Enrichment)
* **Biografia:** Campo de texto livre para o colaborador contar sua história.
* **Edição de Dados:** Interface para atualização de informações que não constam no AD (Active Directory).
* **Visualização:** Os perfis são públicos para todos os colaboradores através do "Diretório".

---

## 3. O Dashboard (Tela Principal)

A tela principal atua como o **Hub de Informação**, centralizando os cards mais importantes do dia a dia.

* **Resumo Geral:** Visão macro das atualizações recentes.
* **Notícias em Destaque:** Carrossel ou listagem das notícias corporativas vigentes.
* **Diretório de Colaboradores:** Acesso rápido à busca de perfis.
* **Álbum de Fotos:** Galeria visual de eventos e momentos da empresa.
* **Cards de Celebração (Animações):**
    1.  **Aniversariantes:** Destaque para quem completa ano de vida no dia/mês.
    2.  **Tempo de Casa:** Card especial com animação para celebrar aniversário de empresa.

---

## 4. Módulos de Navegação (Abas de Atalho)

O sistema é dividido em módulos funcionais acessíveis via atalhos rápidos.

| Aba | Nome do Módulo | Função Principal | Conteúdo Típico |
| :--- | :--- | :--- | :--- |
| **SYS** | Sistemas | Hub de Links Externos | Atalhos para ERP, CRM, Sites de benefícios. |
| **DOCS** | Documentos | Repositório de Conhecimento | Políticas internas, Manuais, Normas ISO. |
| **CAL** | Calendário | Gestão de Tempo | Eventos corporativos e *check* diário de aniversários. |
| **TEAM** | Equipe | Estrutura Organizacional | Visualização de departamentos e usuários vinculados. |
| **REF** | Indicações | Recrutamento Interno | Formulário para indicar talentos para vagas abertas. |
| **RANK** | Ranking | Gamificação Competitiva | Lista "Top Users" baseada em conquistas/badges. |

---

## 5. Sistema de Interação (Social Layer)

Além do consumo passivo de conteúdo, a intranet possui uma camada ativa de interação social.

### 5.1 Áreas de Interação
| Funcionalidade | Descrição |
| :--- | :--- |
| **Chat de Equipes** | Mensageria instantânea para comunicação rápida entre departamentos ou grupos. |
| **Mural de Ideias** | Espaço para colaboradores submeterem sugestões de melhoria. |
| **Elogios (Kudos)** | Ferramenta para enviar reconhecimento público a colegas. |
| **Votações (Polls)** | Sistema de enquetes para decisões rápidas ou pesquisas de clima. |

### 5.2 Mecânica de Feedback
* **Comentários:** Permitidos em cards de aniversário, notícias e anúncios.
* **Reações:** Sistema de "Likes" e reações rápidas em postagens.

---

## 6. Fluxo de Notícias e Admin (CMS)

### Módulo de Notícias (Frontend)
1.  **Visualização:** Feed cronológico ou por relevância.
2.  **Filtros:** Busca por categorias ou datas.

### Painel Administrativo (Backend/Permissões)
Usuários com a *flag* de **Admin** ou **Editor** possuem acesso a ferramentas de criação:
1.  **Criação/Edição:** Editor de texto rico para novas postagens.
2.  **Gerenciamento:** Capacidade de ocultar, editar ou excluir notícias antigas.
3.  **Destaques:** Definir quais notícias aparecem no topo do Dashboard.

---

## 7. Sistema de Gamificação (Badges & Conquistas)

O engajamento é recompensado através de **Badges** (medalhas virtuais) que aparecem no perfil do usuário e somam pontos para o Ranking.

### 7.1 Badges Implementados (Exemplos)

| Categoria | Badge | Gatilho de Desbloqueio (Ação) |
| :--- | :--- | :--- |
| **Social** | *First Like* | Dar o primeiro "curtir" em qualquer postagem. |
| **Social** | *Enturmado* | Fazer a primeira interação (comentário ou chat). |
| **Perfil** | *Identidade* | Preencher 100% dos dados do perfil (bio + foto). |
| **Ideias** | *Inovador* | Submeter a primeira ideia no mural. |
| **Carreira** | *Veterano* | Alcançar marcos de tempo de casa (ex: 1 ano, 5 anos). |

> **Backlog:** Badges sazonais (ex: Natal, Outubro Rosa) e níveis de badges (Bronze, Prata, Ouro).

---

## 8. Sistema de Notificações (Alertas)

O sistema mantém o usuário informado através de um centro de notificações em tempo real.

### 8.1 Gatilhos de Notificação
* **Menções:** Sempre que o usuário for marcado com "@" em chats ou comentários.
* **Conteúdo Novo:** Alerta de "Nova Notícia" publicada pelos administradores.
* **Interações Sociais:**
    * Novas votações/enquetes abertas.
    * Novos comentários em cards de aniversário do próprio usuário.
    * Recebimento de um Elogio/Kudo.

### 8.2 Visualização
* **Ícone de Sininho:** Contador de notificações não lidas no topo da página.
* **Lista:** Dropdown com histórico recente de alertas clicáveis que levam ao conteúdo.