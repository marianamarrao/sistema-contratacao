# Prompt mestre — Pipeline CI/CD

> Prompt base do projeto: reúne o plano em um único texto, que serviu de ponto de partida. Não foi o único prompt: ele foi complementado por vários outros ao longo da execução, todos registrados em [prompts-ia.md](prompts-ia.md). Segredos aparecem como `<PLACEHOLDER>`; os valores reais ficam só em GitHub Secrets / env do Render.

## Prompt

Você vai me ajudar a criar a pipeline CI/CD do meu projeto `sistema-contratacao` (GitHub: `marianamarrao/sistema-contratacao`) usando GitHub Actions, para a atividade **"LAB – DevOps – Pipeline CI/CD com IA Generativa"** do Instituto J&F.

### Documentos que estou disponibilizando (leia tudo antes de começar)
1. **`Lab CICD-Pipeline.pdf`** — o enunciado. É a especificação que a pipeline deve cumprir.
2. **`07 - CI - IntegracaoContinua.pdf`** — aula de CI: o pipeline como Build → Test → Release → Deploy e a estrutura Event → Job → Steps do GitHub Actions.
3. **`08 - CI - GitAction_Docker.pdf`** — aula de GitHub Actions com Docker: build e push de imagem no Docker Hub, com credenciais em Secrets.

Siga o que foi passado em aula (nomenclatura, estrutura e uso de Docker Hub e Secrets), mas use versões atuais das actions.

### Sobre o projeto
Monorepo com `backend/` (Spring Boot 4.1.1, Java 17, Maven wrapper, PostgreSQL via variáveis `DATABASE_*`) e `frontend/` (React 19 + Vite 8, npm, oxlint). Não há `.github/`, Dockerfile, `.gitignore` na raiz nem `.env.example`. O único teste (`contextLoads`) precisa de um PostgreSQL acessível.

### O que a pipeline deve fazer (requisitos do enunciado)
- Executar a CI a cada `push` na `main` e também em `pull_request` para a `main`.
- Fazer checkout, configurar o ambiente (Java 17 / Node 20), instalar dependências e executar teste/validação.
- Executar o CD após um `push` na `main`, **somente se a CI tiver concluído com sucesso**.
- Fazer o deployment em um ambiente acessível, com estratégia justificada.

### Decisões que já tomei
- **Banco:** PostgreSQL gerenciado no **Neon** (não service container). A connection string será dividida em `DATABASE_HOST/PORT/BANCO/USERNAME/PASSWORD`. O driver JDBC não suporta `channel_binding`, então use só `sslmode=require`.
- **Deploy:** backend no **Render** (imagem Docker) e frontend no **GitHub Pages**.
- **Release (aula 08):** build e push da imagem do backend no **Docker Hub**, com tags `latest` e SHA, usando `DOCKER_USERNAME` e `DOCKER_PASSWORD` (token) em Secrets.

### O que executar, em fases
1. **Registro e planejamento:** crie `task.md` e mantenha `docs/prompts-ia.md` atualizado a cada interação, com prompt, resultado, problema, alteração e se foi IA ou manual.
2. **Preparar o repositório:** `.gitignore` na raiz, `backend/.env.example`, compiler Java 8 → 17 no `pom.xml`, `sslmode` configurável em `application.properties`, CORS por variável de ambiente incluindo `PATCH`, `base` do Vite para o Pages, README atualizado.
3. **CI** (`.github/workflows/ci.yml`): job backend (`./mvnw -B verify` com os secrets do Neon) e job frontend (`npm ci`, lint, build, upload-artifact do `dist`). Use `permissions` mínimas e `concurrency`.
4. **Docker:** `backend/Dockerfile` multi-stage (JDK 17 para build, JRE 17 para rodar), usuário não-root, e `.dockerignore`. Teste com `docker build` e `docker run`.
5. **CD** (`.github/workflows/cd.yml`): disparado por `workflow_run` do CI, com condição `success` + `push` na `main`. Jobs: Release (Docker Hub), Deploy backend (Deploy Hook do Render + health-check) e Deploy frontend (Pages). Passe segredos via `env`.
6. **Validação final contra o enunciado:** confira ponto a ponto, com evidência (trecho do yml, run, URL): CI em push e PR, checkout, setup, dependências, teste, CD só com CI verde (prove com um run vermelho), deploy acessível, estratégia justificada, alinhamento às aulas, nenhum segredo no repositório e registro completo.

### Regras de trabalho
- Valide tudo localmente antes de commitar e diagnostique os erros reais dos runs do GitHub.
- Commits **sem** coautoria do Claude e sem a linha "Generated with Claude Code" em PRs.
- Nada de credenciais em arquivos versionados, prompts ou prints do PDF.
- Quando algo depender de uma ação minha (criar conta, cadastrar token, habilitar Pages), me diga exatamente o que fazer.
- Ao final, entregue o material para um único PDF: link do repo, os `.yml`, os prompts, o registro de alterações, a análise (nº de prompts, problemas, alterações necessárias e manuais, como verifiquei) e as evidências.
