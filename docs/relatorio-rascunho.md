# Relatório — Pipeline CI/CD com IA Generativa (RASCUNHO)

> Rascunho elaborado com apoio de IA (registrado em `prompts-ia.md`, linha 18). Reescreva com as suas palavras, confira cada número no registro e ajuste o que não refletir o que você viveu. Itens entre `[...]` são para você completar.

**Aluna:** [seu nome] · **Disciplina:** DevOps · **Repositório:** https://github.com/marianamarrao/sistema-contratacao
**Aplicação publicada:** https://marianamarrao.github.io/sistema-contratacao/ (frontend) e https://sistema-contratacao-backend.onrender.com (API)

## 1. Projeto e pipeline

O projeto é o **Sistema de Contratação**: backend Spring Boot (Java 17) com PostgreSQL e frontend React + Vite.

**Autoria:** o sistema (backend, frontend e banco) foi desenvolvido anteriormente em grupo, com os colegas Davi do Nascimento Costa e Lorenzo Lima de Oliveira, como projeto da disciplina de Desenvolvimento. A parte pedida neste enunciado, **adicionar a CI/CD ao projeto**, foi feita por mim, com apoio de IA nas tarefas permitidas e com a validação de cada etapa por mim. Isso inclui os workflows, o `Dockerfile`, os ajustes de configuração necessários para publicar o sistema e a configuração dos serviços de deploy.

Criei uma pipeline com dois workflows do GitHub Actions:

- **CI (`.github/workflows/ci.yml`)** — roda em `push` e em `pull_request` na `main`. Faz checkout, configura Java 17 e Node 20, instala dependências, compila e testa o backend (`./mvnw verify`, contra um banco PostgreSQL no Neon) e executa lint e build do frontend, guardando o `dist` como artefato.
- **CD (`.github/workflows/cd.yml`)** — roda quando o CI termina na `main` e **só segue se o CI foi concluído com sucesso e o evento foi push**. Tem três etapas encadeadas: **Release** (build e publicação da imagem Docker no Docker Hub), **Deploy do backend** (Render, acionado por Deploy Hook, com health-check) e **Deploy do frontend** (GitHub Pages).

Também criei um `Dockerfile` multi-stage para o backend e ajustei o código para funcionar fora da máquina local (SSL do banco, CORS configurável e Java 17 no compilador).

## 2. Estratégia de deployment e justificativa

[Use o texto de `docs/justificativa-deploy.md`, adaptando com as suas palavras. Pontos principais:]
o projeto tem três partes diferentes, e escolhi o serviço mais adequado para cada uma: **GitHub Pages** para o frontend estático, **Render** para o backend (precisa rodar continuamente), **Docker Hub** como registro da imagem (etapa de Release vista na aula 08) e **Neon** como PostgreSQL gerenciado. Tudo é acionado pelo GitHub Actions, e o deploy só acontece depois de a CI passar.

## 3. Uso da IA

Usei o **Claude Code** para criar e ajustar a pipeline, explicar o código, identificar erros e sugerir correções, e o **CodeRabbit** para revisar automaticamente os pull requests. Os prompts estão em `docs/prompts-ia.md`, com resultado, problema e alteração de cada interação. Tudo o que a IA gerou foi testado e conferido por mim nos runs do GitHub, no Docker local e na aplicação publicada.

## 4. Análise (respostas às 5 perguntas do enunciado)

**1. Quantos prompts foram necessários para chegar à versão final?**
O registro tem 18 interações. Destas, 4 foram apenas manuais (escolhas de arquitetura, criação do banco no Neon, conferência do run vermelho e revisão crítica). As demais 14 envolveram IA, sendo [11] interações com o Claude Code e [2] revisões do CodeRabbit. [Defina o que você conta como "prompt" e ajuste o número.]

**2. Quais foram os principais problemas encontrados?**
- O CI falhou no primeiro run: `./mvnw: Permission denied`, porque o `mvnw` foi versionado sem permissão de execução (repositório criado no Windows).
- O `npm run build` quebrava localmente por causa do caractere `&` no caminho da pasta; foi contornado rodando os binários pelo `node`.
- O driver JDBC do PostgreSQL não suporta `channel_binding`, usado na connection string do Neon.
- O `pom.xml` compilava em Java 8 enquanto o projeto usa Java 17, e o CORS não liberava `PATCH`.
- O primeiro CD falhou no deploy do backend por faltar o Deploy Hook do Render, e o frontend foi pulado.
- A API devolve 404 com a lista vazia, o que quebraria um health-check que só aceita 200.
- O banco novo no Neon não tinha os dados de `status` e `departamento`, e as tabelas criadas pelo Hibernate não geram o `id` sozinhas.

**3. Quais alterações foram necessárias?**
`ci.yml` e `cd.yml` (novos); `Dockerfile` e `.dockerignore`; permissão de execução no `mvnw`; compilador Java 17 no `pom.xml`; `sslmode` configurável em `application.properties`; CORS por variável de ambiente e com `PATCH` em `WebConfig.java`; `base` do Vite para o GitHub Pages; health-check do CD que aceita 404 apenas com o campo `mensagem` da API (sugestão do CodeRabbit); `.gitignore`, `.env.example` e README atualizado.

**4. Quais alterações foram realizadas manualmente?**
[Complete com o que você fez:] criação do banco no Neon e fornecimento das credenciais; conta e token no Docker Hub e cadastro do `DOCKER_USERNAME` e `DOCKER_PASSWORD`; instalação do GitHub CLI e login; criação do serviço no Render e configuração das variáveis de ambiente; cadastro do Deploy Hook; habilitação do GitHub Pages; decisões de arquitetura; conferência dos runs e testes da aplicação publicada; merge dos pull requests.

**5. Como você verificou que a pipeline estava funcionando corretamente?**
- **CI:** o run em `pull_request` (PR #9) e o run em `push` na `main` ficaram verdes, e o run vermelho do `mvnw` mostrou que o CI detecta falhas.
- **CD só com CI verde:** o CD é acionado por `workflow_run` com a condição `success` e `push`, e os jobs dependem uns dos outros. No primeiro CD, a falha do Deploy backend fez o Deploy frontend ser pulado. [Acrescente a evidência do PR de teste com lint quebrado, se fizer.]
- **Imagem:** o `docker build` e o `docker run` locais e a imagem publicada no Docker Hub.
- **Aplicação:** a API do Render responde, o CORS aceita a origem do GitHub Pages e o site publicado lista os dados vindos da API.

## 5. Evidências

As imagens estão em `docs/evidencias/`, descritas na tabela do final de `prompts-ia.md`:
CI verde no PR (01, 02) · CI vermelho do `mvnw` (04) · histórico do PR (03) · CI verde na `main` (05) · imagem no Docker Hub (06) · serviço Live no Render (07) · aplicação publicada (08) · CD completo verde (09, 10).

## 6. Limitações e melhorias

- O CI usa o banco real do Neon por secrets: PRs de forks não recebem secrets e o `ddl-auto=update` altera o banco. O ideal seria um banco separado para testes.
- Os planos gratuitos do Render e do Neon "dormem", o que deixa a primeira requisição lenta.
- O health-check usa `GET /funcionarios`; um endpoint dedicado de saúde seria mais robusto.

## 7. Conclusão

[Escreva 3 a 5 linhas com o seu aprendizado: o que a IA ajudou, o que você precisou validar ou corrigir, e o que mudaria numa próxima vez.]
