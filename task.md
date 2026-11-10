# task.md — Pipeline CI/CD (Lab DevOps)

Fonte: enunciado do lab (`Lab CICD-Pipeline.pdf`) e aulas 07 (CI) e 08 (GitHub Actions + Docker); plano completo em `docs/prompt-mestre.md`.

Projeto: `sistema-contratacao` (backend Spring Boot 4.1.1 / Java 17 / Maven, frontend React 19 + Vite 8, PostgreSQL no **Neon**).
Estratégia: **Build → Test → Release → Deploy** (aula 07), com imagem Docker no **Docker Hub** (aula 08), backend no **Render**, frontend no **GitHub Pages**.

> Segredos (senha do Neon, tokens) ficam **somente** em GitHub Secrets / env do Render / `backend/.env` (ignorado pelo git). Nunca neste arquivo.

## Fase 0 — Registro
- [ ] Manter `docs/prompts-ia.md` atualizado a cada interação (prompt, resultado, problema, alteração, IA vs. manual)

## Fase 1 — Preparação do repositório
- [x] `.gitignore` na raiz e `backend/.env.example` (DATABASE_HOST/PORT/BANCO/USERNAME/PASSWORD)
- [x] `backend/pom.xml`: compiler `source/target` 8 → 17
- [x] `application.properties`: `sslmode` por variável (Neon exige SSL; sem `channel_binding`)
- [x] `WebConfig.java`: CORS por env (`CORS_ALLOWED_ORIGINS`) + método PATCH
- [x] `frontend/vite.config.js`: `base` para GitHub Pages; `VITE_API_URL` no build
- [x] README atualizado (Postgres, CI/CD, URLs públicas)
- [ ] Rotacionar a senha do Neon (foi exposta em chat) e validar `./mvnw -B verify` local

## Fase 2 — CI (`.github/workflows/ci.yml`)
- [x] Gatilhos: `push` e `pull_request` na `main`
- [x] Job backend: checkout, setup-java 17, cache Maven, `./mvnw -B verify` (secrets DATABASE_*)
- [x] Job frontend: checkout, setup-node 20, `npm ci`, `npm run lint`, `npm run build`, `upload-artifact` do `dist`

## Fase 3 — Docker
- [x] `backend/Dockerfile` multi-stage (JDK 17 build → JRE 17) + `.dockerignore`
- [ ] Testar `docker build` local

## Fase 4 — CD (`.github/workflows/cd.yml`)
- [x] Disparo por `workflow_run` do CI: só com `conclusion == success` e `event == push` na `main`
- [x] Release: build + push da imagem no Docker Hub (`DOCKER_USERNAME`, `DOCKER_PASSWORD`), tags `latest` + SHA
- [x] Deploy backend: Deploy Hook do Render (`RENDER_DEPLOY_HOOK_URL`) + health-check
- [x] Deploy frontend: GitHub Pages (`actions/deploy-pages`)
- [ ] Serviços externos: conta Docker Hub, Web Service no Render (auto-deploy desligado), Pages habilitado

## Fase 5 — Validação final contra a especificação
- [ ] CI em push na main e em PR para main
- [ ] Checkout, setup, instalação de dependências, teste/validação
- [ ] CD somente após push na main com CI verde (provar com run vermelho: CD não dispara)
- [ ] App publicada e acessível; CRUD funcionando (valida CORS + banco)
- [ ] Estratégia de deploy justificada
- [ ] Conforme aulas: Build/Test/Release/Deploy, upload-artifact, docker build-push, secrets
- [ ] Nenhum segredo no repo, histórico, logs ou PDF
- [ ] Registro de prompts completo + respostas às 5 perguntas finais

## Fase 6 — Entrega (um único PDF, elaborado pela autora)
- [ ] Link do repo · `ci.yml`/`cd.yml` · prompts · registro de alterações · análise · evidências (prints dos runs e do app)
