# Explicação do código da pipeline

Material de estudo: o que cada arquivo faz e por quê. Os conceitos seguem as aulas 07 (CI) e 08 (GitHub Actions + Docker): **Event → Job → Steps**, e as etapas **Build → Test → Release → Deploy**.

## Visão geral do fluxo

```
push / PR na main ──► CI (ci.yml): Build + Test
                         │ push na main e CI verde
                         ▼
                      CD (cd.yml): Release ─► Deploy backend ─► Deploy frontend
                      (Docker Hub)  (Render)     (GitHub Pages)
```

## `.github/workflows/ci.yml` — Integração Contínua

| Trecho | O que faz | Por quê |
|---|---|---|
| `on: push / pull_request` em `main` | **Event** que dispara o workflow | Exigência do enunciado: CI em push e em PR para a `main` |
| `permissions: contents: read` | Dá ao workflow só permissão de leitura | Menor privilégio: se algo for comprometido, o dano é limitado |
| `concurrency` + `cancel-in-progress` | Cancela runs antigos da mesma branch | Economiza minutos e evita resultados confusos |
| Dois **jobs** (`backend`, `frontend`) | Rodam em paralelo, cada um numa máquina `ubuntu-latest` | Independentes: um falhar não esconde o outro |
| `defaults.run.working-directory` | Roda os comandos dentro de `backend/` ou `frontend/` | O repositório é um monorepo |
| `actions/checkout@v4` | Baixa o código no runner | Sem isso o runner está vazio |
| `actions/setup-java@v4` (temurin 17, `cache: maven`) | Instala o JDK e guarda o cache do Maven | O projeto usa Java 17; o cache acelera os próximos runs |
| `./mvnw -B verify` | Compila, roda os testes e empacota | É a etapa **Build + Test**. `-B` é modo não interativo |
| `env: DATABASE_*` (secrets) | Entrega as credenciais do Neon ao teste | O `contextLoads` sobe o Spring, que precisa do banco |
| `actions/setup-node@v4` (Node 20, `cache: npm`) | Instala o Node e guarda o cache do npm | O frontend é React + Vite |
| `npm ci` | Instala exatamente o que está no `package-lock.json` | Mais reprodutível que `npm install` |
| `npm run lint` / `npm run build` | Valida o código (oxlint) e gera o `dist` | Verificação de qualidade + prova de que compila |
| `actions/upload-artifact@v4` | Guarda o `dist` como artefato do run | Etapa de artefato mostrada na aula 07 |

## `.github/workflows/cd.yml` — Entrega e Deploy

| Trecho | O que faz | Por quê |
|---|---|---|
| `on: workflow_run` do workflow "CI", `types: [completed]`, `branches: [main]` | O CD começa só quando o CI termina | É assim que o CD "espera" a CI |
| `if: conclusion == 'success' && event == 'push'` | Só segue se a CI passou **e** foi um push | Garante "CD somente se a CI for concluída com sucesso" e nunca em PR |
| `needs: release` / `needs: deploy-backend` | Encadeia os jobs | Se um é pulado ou falha, os seguintes também não rodam |
| `checkout` com `ref: head_sha` | Usa o commit exato que a CI validou | Evita publicar um código diferente do testado |
| **Release:** `docker/login-action` + `docker/build-push-action` | Constrói a imagem e envia ao Docker Hub com tags `latest` e SHA | Etapa **Release** da aula 08; o SHA permite voltar a uma versão |
| **Deploy backend:** `curl` no Deploy Hook | Avisa o Render para baixar a nova imagem | O Render não "enxerga" o GitHub; o hook é o gatilho |
| `env: RENDER_DEPLOY_HOOK_URL` | Passa o segredo por variável de ambiente | A URL contém uma chave secreta; assim ela não aparece no log |
| Health-check com `curl` em loop | Espera `GET /funcionarios` responder 200 | O deploy só conta como feito se a aplicação responde |
| **Deploy frontend:** `npm run build` com `VITE_API_URL` e `VITE_BASE` | Gera o site apontando para a API publicada | O front precisa saber a URL do backend e o caminho do Pages |
| `configure-pages` / `upload-pages-artifact` / `deploy-pages` | Publicam o `dist` no GitHub Pages | Hospedagem estática gratuita |

## `backend/Dockerfile` — empacotamento

- **Multi-stage:** o primeiro estágio (`jdk`) compila com Maven; o segundo (`jre`) só roda o `.jar`. A imagem final fica menor e sem ferramentas de build.
- `COPY pom.xml` antes de `COPY src`: o Docker reaproveita o cache das dependências quando só o código muda.
- `sed -i 's/\r$//' mvnw`: remove quebras de linha do Windows, que impedem o script de rodar no Linux.
- `useradd` + `USER app`: o container não roda como root.
- Nenhuma credencial na imagem: as variáveis `DATABASE_*` chegam em tempo de execução pelo Render.

## Alterações no código da aplicação

- **`pom.xml`:** o compilador estava em Java 8 enquanto o projeto usa Java 17. Agora usa `<release>17</release>`.
- **`application.properties`:** a URL do banco ganhou `?sslmode=${DATABASE_SSLMODE:prefer}`. O Neon exige SSL (`require`); localmente o padrão `prefer` continua funcionando.
- **`WebConfig.java`:** a origem do CORS vem de `CORS_ALLOWED_ORIGINS` e o método `PATCH` foi liberado. Sem isso o navegador bloquearia o front publicado em outro domínio.
- **`vite.config.js`:** `base` configurável, porque o GitHub Pages serve o site em `/sistema-contratacao/`, não na raiz.
- **`mvnw` com bit de execução:** o arquivo foi criado no Windows e o Linux do runner recusou executá-lo (`Permission denied`).

## Conceitos para fixar

- **CI** valida cada mudança com build e testes automáticos. **CD** entrega o que a CI aprovou.
- **Secrets** guardam credenciais fora do código; o log mascara seus valores com `***`.
- **Artefato** é o resultado de um build (o `dist`, a imagem Docker) que passa de uma etapa para outra.
- **Idempotência do deploy:** a imagem é identificada pelo SHA do commit, então cada versão publicada é rastreável.
