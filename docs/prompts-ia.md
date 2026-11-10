# Registro de prompts — Pipeline CI/CD com IA

Ferramenta de IA: Claude Code. Formato por interação: **prompt → resultado → problema → alteração (IA/manual)**.
Placeholders `<...>` nunca são substituídos por segredos reais neste arquivo.

## Prompts planejados

### P1 — Planejamento
**Prompt:** Contexto: monorepo `sistema-contratacao` com `backend/` (Spring Boot 4.1.1, Java 17, Maven wrapper, PostgreSQL via DATABASE_*) e `frontend/` (React 19 + Vite 8, npm, oxlint). Leia o enunciado do lab e os slides 07 (CI) e 08 (Actions + Docker). Gere `task.md` com fases, checklist, riscos e verificação. Não escreva código.
**Resultado obtido:** Plano aprovado e `task.md` criado. Os slides 07/08 foram lidos por extração de texto (`pdftotext`) e o plano foi ajustado para incluir Docker Hub (Release) e Neon como banco.
**Arquivos:** adicionados `task.md`, `docs/prompt-mestre.md` e `docs/prompts-ia.md`.

### P2 — Preparação do repositório
**Prompt:** Prepare o repo para CI/CD sem quebrar o uso local: `.gitignore` raiz, `backend/.env.example`, compiler 8→17 no `pom.xml`, `sslmode` configurável em `application.properties` (Neon, sem channel_binding), CORS por env com PATCH em `WebConfig.java`, `base`/`VITE_API_URL` no Vite. Mostre o diff e rode `./mvnw -B verify` e `npm run build`.
**Resultado obtido:** Criados `.gitignore` e `backend/.env.example`; compiler passou para Java 17; `sslmode` e CORS (com `PATCH`) configuráveis por variável de ambiente; `VITE_BASE` no Vite; README atualizado. Backend compila e o frontend passa no lint e no build.
**Arquivos:** adicionados `.gitignore` e `backend/.env.example`; alterados `backend/pom.xml`, `backend/src/main/resources/application.properties`, `backend/src/main/java/com/example/backend/INFRASTRUCTURE/config/WebConfig.java`, `frontend/vite.config.js` e `README.md`.

### P3 — CI
**Prompt:** Crie `.github/workflows/ci.yml` com nomes de jobs/steps em português seguindo Build → Test: gatilhos push e pull_request na `main`; job backend (checkout@v4, setup-java@v4 temurin 17 com cache maven, `./mvnw -B verify` em `backend/` com secrets DATABASE_*); job frontend (setup-node@v4 Node 20, `npm ci`, `npm run lint`, `npm run build`, upload-artifact@v4 do `dist`). `permissions: contents: read` e `concurrency`. Valide a sintaxe antes de commitar.
**Resultado obtido:** `.github/workflows/ci.yml` criado com os jobs backend e frontend. Falhou no primeiro run por `mvnw` sem permissão de execução (ver P6) e passou no PR #9 depois da correção (run verde https://github.com/marianamarrao/sistema-contratacao/actions/runs/42721304942).
**Arquivos:** adicionado `.github/workflows/ci.yml`.

### P4 — Dockerfile
**Prompt:** Crie `backend/Dockerfile` multi-stage (JDK 17 + mvnw `-DskipTests package` → JRE 17), `EXPOSE 8080`, usuário não-root, `.dockerignore`; DATABASE_* só em runtime. Rode `docker build` e `docker run` com envs do `.env` local.
**Resultado obtido:** `backend/Dockerfile` e `.dockerignore` criados. `docker build` conclui e `docker run` sobe em Java 17 como usuário não-root, falhando só ao conectar no banco (esperado sem credenciais).
**Arquivos:** adicionados `backend/Dockerfile` e `backend/.dockerignore`.

### P5 — CD (Release + Deploy)
**Prompt:** Crie `.github/workflows/cd.yml` disparado por `workflow_run` do workflow "CI" (completed, branches main) com `if: conclusion == 'success' && event == 'push'` em todos os jobs. Jobs: (1) Release — build e push da imagem no Docker Hub com docker/build-push-action, tags `latest` e SHA, secrets DOCKER_USERNAME/DOCKER_PASSWORD; (2) Deploy backend — POST no Deploy Hook do Render (secret) e health-check com retry; (3) Deploy frontend — build com `VITE_API_URL` e `actions/deploy-pages`. Liste secrets, permissões e configurações manuais necessárias.
**Resultado obtido:** `.github/workflows/cd.yml` criado (Release no Docker Hub, Deploy no Render e Pages), com o ajuste do Deploy Hook via `env` sugerido pelo CodeRabbit. Primeira execução após o merge do PR #9: o Release publicou a imagem no Docker Hub (evidência 06) e o Deploy backend falhou por ainda não existir o hook do Render; o Deploy frontend foi pulado por depender dele. Falta configurar Render e Pages.
**Arquivos:** adicionado `.github/workflows/cd.yml`.

### P6 — Diagnóstico de falhas reais
**Prompt:** O run `<link>` falhou com este log: `<trecho>`. Explique a causa, proponha a menor correção e mostre só o trecho alterado. Depois re-execute e confirme.
**Resultado obtido:** Causa identificada: `./mvnw: Permission denied` (exit 126) no run https://github.com/marianamarrao/sistema-contratacao/actions/runs/42719135193. Corrigido com `git update-index --chmod=+x backend/mvnw`, e o run seguinte passou.
**Arquivos:** alterado `backend/mvnw` (permissão de execução, modo `100755`).

### P7 — Validação final contra a especificação
**Prompt:** Releia o enunciado do lab e os slides 07/08. Para cada item, responda em tabela (item · cumprido? · evidência · correção): CI em push e PR na main; checkout; setup do ambiente; instalação de dependências; teste/validação; CD só após push na main com CI verde (prove com um run vermelho); deploy automático em ambiente acessível; estratégia justificada; alinhamento às aulas (Build/Test/Release/Deploy, upload-artifact, docker build-push, secrets); nenhum segredo no repo/histórico/logs; registro de prompts completo. Corrija o que faltar antes de seguir.
**Resultado obtido:** Ainda não executado: será feito depois do merge e do deploy, com evidências.
**Arquivos:** nenhum até o momento.

## Registro de execução

| # | Prompt | Resultado | Problema encontrado | Alteração | IA / Manual |
|---|--------|-----------|---------------------|-----------|-------------|
| 1 | Prompt base ([docs/prompt-mestre.md](prompt-mestre.md)): fornecidos o enunciado do lab e os slides 07 e 08; pedido para começar por um `task.md` de planejamento | Plano e `task.md` | Slides 07/08 só lidos após extrair texto com `pdftotext` (`pdftoppm` ausente) | Plano ajustado: Docker Hub (Release), Neon em vez de Aiven | IA |
| 2 | P2 — preparar repositório (Fase 1) | `.gitignore`, `.env.example`, `release 17`, `sslmode` e CORS por env (com PATCH), `VITE_BASE` | Edit do `pom.xml` falhou (CRLF) → usado `sed`; `npm run build` quebra no caminho com `&` (OneDrive) | Build/lint rodados via `node node_modules/...`; backend `package` OK | IA |
| 3 | P3 — CI (`ci.yml`) | Jobs backend (Java 17, `mvnw verify`, secrets DATABASE_*) e frontend (Node 20, lint, build, upload-artifact) | Nenhum | Secrets `DATABASE_*` cadastrados no GitHub (valores do Neon fornecidos pela autora; cadastro feito com o `gh`, instalado e autenticado por ela) | IA + **Manual** |
| 4 | P4 — Dockerfile | `backend/Dockerfile` multi-stage (JDK 17 → JRE 17, usuário não-root) + `.dockerignore`. Testado localmente: `docker build` conclui e `docker run` sobe em Java 17 como usuário não-root, falhando só ao conectar no banco (esperado sem credenciais) | Docker Desktop estava desligado na primeira tentativa de build | Docker Desktop ligado e build refeito (ver linha 12) | IA |
| 5 | P5 — CD (`cd.yml`) | `workflow_run` do CI com `if` success+push; jobs Release (Docker Hub), Deploy backend (Render hook + health-check em `GET /funcionarios`) e Deploy frontend (Pages) | Nenhum | Criado `.github/workflows/cd.yml`; secrets `DOCKER_*`, `RENDER_DEPLOY_HOOK_URL` e variável `BACKEND_URL` serão cadastrados nas etapas seguintes | IA |
| 6 | P6 — diagnóstico do run do PR #9 | Job backend falhou em 5s: `./mvnw: Permission denied` (exit 126), run vermelho https://github.com/marianamarrao/sistema-contratacao/actions/runs/42719135193 | `mvnw` versionado sem bit de execução (repo criado no Windows); run verde após a correção: https://github.com/marianamarrao/sistema-contratacao/actions/runs/42721304942 | `git update-index --chmod=+x backend/mvnw` | IA |
| 7 | Revisão do CodeRabbit no PR #9 | 2 comentários: (cd.yml) hook do Render é segredo, passar via env e `--max-time`; (ci.yml) PRs de forks não recebem secrets e `ddl-auto=update` altera o banco real | Sugestão do cd.yml aplicada; a do ci.yml é limitação conhecida da escolha pelo Neon | `cd.yml`: secret via `env` | IA |
| 8 | Pedido para analisar os comentários do CodeRabbit no PR, remover do PR a linha "Generated with Claude Code" e investigar o check com falha | Linha removida do PR #9; comentário do cd.yml aplicado; check vermelho explicado (run antigo, anterior ao `chmod +x`) | O force-push refez o run antes da correção entrar | Commit `0416934` | IA |
| 9 | Troca de Aiven por Neon (connection string colada no chat) | `DATABASE_*` separados e cadastrados como secrets via `gh secret set` | `channel_binding` não é suportado pelo pgjdbc (usado só `sslmode=require`) | 5 secrets no GitHub | IA + manual (fornecer as credenciais) |
| 10 | Escolhas de arquitetura (respostas às perguntas da IA) | Deploy: Render + GitHub Pages/Vercel; banco de testes: serviço gerenciado em nuvem | A IA propunha service container; a usuária preferiu banco externo | Plano ajustado (Neon) | **Manual** (decisão) |
| 11 | Criação do banco PostgreSQL no Neon | Banco `neondb` criado e connection string fornecida | — | Usada para gerar os secrets `DATABASE_*` | **Manual** |
| 12 | Ligar o Docker Desktop para testar a imagem | `docker build` e `docker run` executados com sucesso | Docker Desktop estava desligado na primeira tentativa | — | **Manual** (ligar) + IA (testes) |
| 13 | Conferir o run vermelho no GitHub (print do job "Backend - Build e Test") | Erro `Permission denied` identificado no passo "Build e testes (mvnw verify)" | Confusão entre run antigo e atual | Confirmado que o run mais recente estava verde | **Manual** (validação) |
| 14 | Revisão crítica e validação da solução feita por mim | Plano e solução conferidos contra o enunciado e as aulas, com ajustes até ficarem completos | Nenhum | Etapa de validação incluída em `docs/prompt-mestre.md` | **Manual** |
| 15 | Pedido para explicar o código da pipeline e registrar a explicação nos prompts, deixando claro o objetivo de aprender e não só obter a solução pronta | [docs/explicacao-codigo.md](explicacao-codigo.md): explicação de `ci.yml`, `cd.yml`, `Dockerfile` e das alterações de código, ligada às aulas 07 e 08 | — | Documento de estudo criado; pedido registrado como prática de aprendizado | IA (explicação) + **Manual** (decisão de estudar o código, não só usar) |
| 16 | Pedido de rascunho da justificativa da estratégia de deploy (exigida no relatório) | [docs/justificativa-deploy.md](justificativa-deploy.md): justificativa de Render, GitHub Pages, Docker Hub e Neon, ligada ao enunciado e às aulas | Nenhum | Arquivo `docs/justificativa-deploy.md` adicionado; texto a ser revisado e adaptado pela autora | IA (rascunho) + **Manual** (revisão) |

**Nota de aprendizado:** a autora valorizou entender o que a pipeline faz, e não apenas obtê-la pronta. Por isso pediu explicações do código, conferiu os runs no GitHub, questionou o registro de prompts e corrigiu a abordagem do plano mais de uma vez. O material de estudo está em `docs/explicacao-codigo.md`.

*Os prompts de conversa das linhas 1, 8 e 15 estão resumidos e reescritos para clareza; o sentido original foi mantido.*

**Arquivos da explicação do código (linha 15):** adicionado `docs/explicacao-codigo.md`.

## Evidências (prints)

| Print | O que mostra | Relaciona-se a |
|---|---|---|
| [01-pr9-checks-verdes.png](evidencias/01-pr9-checks-verdes.png) | PR #9 aberto, aba Checks do último commit: CI (`on: pull_request`) com os jobs Backend (Java 17) e Frontend (Node 20) verdes | P3, linha 3 |
| [02-run-ci-frontend-verde.png](evidencias/02-run-ci-frontend-verde.png) | Run `#24` do CI: job Frontend com checkout, setup do Node 20, instalação de dependências, lint, build e upload do artefato `dist` concluídos | P3 |
| [03-pr9-historico-de-commits.png](evidencias/03-pr9-historico-de-commits.png) | Histórico de commits do PR #9, com o resultado dos checks em cada commit, incluindo o commit de correção do `mvnw` | P6, linha 6 |
| [04-run-ci-backend-vermelho-mvnw.png](evidencias/04-run-ci-backend-vermelho-mvnw.png) | Run vermelho do CI: job Backend falhou em `./mvnw -B verify` com `Permission denied` (exit 126) | P6, linha 6 |
| [05-run-ci-main-verde.png](evidencias/05-run-ci-main-verde.png) | Run `#26` do CI na `main` (`on: push`), disparado pelo merge do PR #9: jobs Backend e Frontend verdes, com 1 artefato | CI em push na `main` |
| [06-dockerhub-imagem-publicada.png](evidencias/06-dockerhub-imagem-publicada.png) | Repositório `marianamarrao/sistema-contratacao-backend` no Docker Hub, com a tag `latest` atualizada pelo Release do CD | P5, etapa Release |
