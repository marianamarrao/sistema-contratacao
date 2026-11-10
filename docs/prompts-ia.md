# Registro de prompts — Pipeline CI/CD com IA

Ferramenta de IA: Claude Code. Formato por interação: **prompt → resultado → problema → alteração (IA/manual)**.
Placeholders `<...>` nunca são substituídos por segredos reais neste arquivo.

## Prompts planejados

### P1 — Planejamento
**Prompt:** Contexto: monorepo `sistema-contratacao` com `backend/` (Spring Boot 4.1.1, Java 17, Maven wrapper, PostgreSQL via DATABASE_*) e `frontend/` (React 19 + Vite 8, npm, oxlint). Leia o enunciado do lab e os slides 07 (CI) e 08 (Actions + Docker). Gere `task.md` com fases, checklist, riscos e verificação. Não escreva código.

### P2 — Preparação do repositório
**Prompt:** Prepare o repo para CI/CD sem quebrar o uso local: `.gitignore` raiz, `backend/.env.example`, compiler 8→17 no `pom.xml`, `sslmode` configurável em `application.properties` (Neon, sem channel_binding), CORS por env com PATCH em `WebConfig.java`, `base`/`VITE_API_URL` no Vite. Mostre o diff e rode `./mvnw -B verify` e `npm run build`.

### P3 — CI
**Prompt:** Crie `.github/workflows/ci.yml` com nomes de jobs/steps em português seguindo Build → Test: gatilhos push e pull_request na `main`; job backend (checkout@v4, setup-java@v4 temurin 17 com cache maven, `./mvnw -B verify` em `backend/` com secrets DATABASE_*); job frontend (setup-node@v4 Node 20, `npm ci`, `npm run lint`, `npm run build`, upload-artifact@v4 do `dist`). `permissions: contents: read` e `concurrency`. Valide a sintaxe antes de commitar.

### P4 — Dockerfile
**Prompt:** Crie `backend/Dockerfile` multi-stage (JDK 17 + mvnw `-DskipTests package` → JRE 17), `EXPOSE 8080`, usuário não-root, `.dockerignore`; DATABASE_* só em runtime. Rode `docker build` e `docker run` com envs do `.env` local.

### P5 — CD (Release + Deploy)
**Prompt:** Crie `.github/workflows/cd.yml` disparado por `workflow_run` do workflow "CI" (completed, branches main) com `if: conclusion == 'success' && event == 'push'` em todos os jobs. Jobs: (1) Release — build e push da imagem no Docker Hub com docker/build-push-action, tags `latest` e SHA, secrets DOCKER_USERNAME/DOCKER_PASSWORD; (2) Deploy backend — POST no Deploy Hook do Render (secret) e health-check com retry; (3) Deploy frontend — build com `VITE_API_URL` e `actions/deploy-pages`. Liste secrets, permissões e configurações manuais necessárias.

### P6 — Diagnóstico de falhas reais
**Prompt:** O run `<link>` falhou com este log: `<trecho>`. Explique a causa, proponha a menor correção e mostre só o trecho alterado. Depois re-execute e confirme.

### P7 — Validação final contra a especificação
**Prompt:** Releia o enunciado do lab e os slides 07/08. Para cada item, responda em tabela (item · cumprido? · evidência · correção): CI em push e PR na main; checkout; setup do ambiente; instalação de dependências; teste/validação; CD só após push na main com CI verde (prove com um run vermelho); deploy automático em ambiente acessível; estratégia justificada; alinhamento às aulas (Build/Test/Release/Deploy, upload-artifact, docker build-push, secrets); nenhum segredo no repo/histórico/logs; registro de prompts completo. Corrija o que faltar antes de seguir.

## Registro de execução

| # | Prompt | Resultado | Problema encontrado | Alteração | IA / Manual |
|---|--------|-----------|---------------------|-----------|-------------|
| 1 | Prompt base ([docs/prompt-mestre.md](prompt-mestre.md)): enunciado do lab + slides 07 e 08 fornecidos; "vamos fazer um task.md/planejamento primeiro" | Plano e `task.md` | Slides 07/08 só lidos após extrair texto com `pdftotext` (`pdftoppm` ausente) | Plano ajustado: Docker Hub (Release), Neon em vez de Aiven | IA |
| 2 | P2 — preparar repositório (Fase 1) | `.gitignore`, `.env.example`, `release 17`, `sslmode` e CORS por env (com PATCH), `VITE_BASE` | Edit do `pom.xml` falhou (CRLF) → usado `sed`; `npm run build` quebra no caminho com `&` (OneDrive) | Build/lint rodados via `node node_modules/...`; backend `package` OK | IA |
| 3 | P3 — CI (`ci.yml`) | Jobs backend (Java 17, `mvnw verify`, secrets DATABASE_*) e frontend (Node 20, lint, build, upload-artifact) | Nenhum | Secrets `DATABASE_*` cadastrados no GitHub (valores do Neon fornecidos pela autora; cadastro feito com o `gh`, instalado e autenticado por ela) | IA + **Manual** |
| 4 | P4 — Dockerfile | `backend/Dockerfile` multi-stage (JDK 17 → JRE 17, usuário não-root) + `.dockerignore` | `docker build` e `docker run` testados localmente (sobe em Java 17, usuário não-root, falha só ao conectar no banco, como esperado) | — | IA |
| 5 | P5 — CD (`cd.yml`) | `workflow_run` do CI com `if` success+push; jobs Release (Docker Hub), Deploy backend (Render hook + health-check), Deploy frontend (Pages) | Não executado ainda; exige secrets DOCKER_*, RENDER_DEPLOY_HOOK_URL e variável BACKEND_URL; health-check usa GET /funcionarios | — | IA |
| 6 | P6 — diagnóstico do run do PR #9 | Job backend falhou em 5s: `./mvnw: Permission denied` (exit 126), run vermelho https://github.com/marianamarrao/sistema-contratacao/actions/runs/42719135193 | `mvnw` versionado sem bit de execução (repo criado no Windows); run verde após a correção: https://github.com/marianamarrao/sistema-contratacao/actions/runs/42721304942 | `git update-index --chmod=+x backend/mvnw` | IA |
| 7 | Revisão do CodeRabbit no PR #9 | 2 comentários: (cd.yml) hook do Render é segredo, passar via env e `--max-time`; (ci.yml) PRs de forks não recebem secrets e `ddl-auto=update` altera o banco real | Sugestão do cd.yml aplicada; a do ci.yml é limitação conhecida da escolha pelo Neon | `cd.yml`: secret via `env` | IA |
| 8 | "veja os comentários do code rabbit, tire o 'Generated with Claude Code' e veja por que tem um check falhando" | Linha removida do PR #9; comentário do cd.yml aplicado; check vermelho explicado (run antigo, anterior ao `chmod +x`) | O force-push refez o run antes da correção entrar | Commit `0416934` | IA |
| 9 | "sem Claude commit ou commit com coautoria" → escolha: remover Claude | Commit reescrito sem `Co-Authored-By`, `--force-with-lease` só na branch do PR | Reescrita de histórico já enviado | `git commit --amend` + force-push da `feat/pipeline-cicd` | IA |
| 10 | Troca de Aiven por Neon (connection string colada no chat) | `DATABASE_*` separados e cadastrados como secrets via `gh secret set` | Senha exposta no chat; `channel_binding` não suportado pelo pgjdbc (usado só `sslmode=require`) | 5 secrets no GitHub | IA + manual (fornecer as credenciais) |
| 11 | Instalar `gh` sem admin | `gh` 2.103.3 em `C:\Users\marianafelis-ieg\gh\bin`, PR #9 aberto por ele | `gh` ausente impediu abrir o PR no primeiro momento | Download do `.zip` e `gh auth login` | **Manual** |
| 12 | Docker Hub: conta, token e secrets | `DOCKER_USERNAME` cadastrado pela IA; `DOCKER_PASSWORD` cadastrado pela usuária | Token digitado errado (5 caracteres no lugar do token); o Docker Hub não mostra o token de novo | Recadastro do secret com token novo | **Manual** |
| 13 | Escolhas de arquitetura (respostas às perguntas da IA) | Deploy: Render + GitHub Pages/Vercel; banco de testes: serviço gerenciado em nuvem | A IA propunha service container; a usuária preferiu banco externo | Plano ajustado (Neon) | **Manual** (decisão) |
| 14 | Criação do banco PostgreSQL no Neon | Banco `neondb` criado e connection string fornecida | — | Usada para gerar os secrets `DATABASE_*` | **Manual** |
| 15 | Ligar o Docker Desktop para testar a imagem | `docker build` e `docker run` executados com sucesso | Docker Desktop estava desligado na primeira tentativa | — | **Manual** (ligar) + IA (testes) |
| 16 | Conferir o run vermelho no GitHub (print do job "Backend - Build e Test") | Erro `Permission denied` identificado no passo "Build e testes (mvnw verify)" | Confusão entre run antigo e atual | Confirmado que o run mais recente estava verde | **Manual** (validação) |
| 17 | Revisão crítica do plano (rejeitado até incluir slides 07/08, Docker Hub e validação final) | Plano ampliado e etapa de validação contra o enunciado incluída | Plano inicial não cobria Release no Docker Hub nem a validação final | `docs/prompt-mestre.md` | **Manual** (revisão) |
| 18 | "quero que você me explique o código e adicione isso aos prompts, dizendo que eu valorizei aprender" | [docs/explicacao-codigo.md](explicacao-codigo.md): explicação de `ci.yml`, `cd.yml`, `Dockerfile` e das alterações de código, ligada às aulas 07 e 08 | — | Documento de estudo criado; pedido registrado como prática de aprendizado | IA (explicação) + **Manual** (decisão de estudar o código, não só usar) |

**Nota de aprendizado:** a autora valorizou entender o que a pipeline faz, e não apenas obtê-la pronta. Por isso pediu explicações do código, conferiu os runs no GitHub, questionou o registro de prompts e corrigiu a abordagem do plano mais de uma vez. O material de estudo está em `docs/explicacao-codigo.md`.
