# Justificativa da estratégia de deployment

> Rascunho elaborado com apoio de IA (registrado em `prompts-ia.md`), para revisão e adaptação pela autora.

## Características do projeto que guiaram a escolha

O `sistema-contratacao` é uma aplicação em **três partes** com necessidades diferentes:

- um **frontend** React + Vite, que após o build vira arquivos estáticos (HTML, CSS e JS);
- um **backend** Spring Boot (Java 17) que precisa de um processo em execução e de variáveis de ambiente com credenciais;
- um banco **PostgreSQL**, exigido pelo backend.

Por isso, uma única plataforma não atende bem às três partes. A estratégia foi escolher, para cada parte, o serviço mais adequado, mantendo tudo acionado automaticamente pelo GitHub Actions a cada push na `main`, depois de a CI ser concluída com sucesso.

## Escolhas

| Parte | Serviço | Por que |
|---|---|---|
| Frontend | **GitHub Pages** | O resultado do build é estático, e o Pages hospeda esse tipo de conteúdo sem servidor. Fica no mesmo repositório e usa as actions oficiais (`configure-pages`, `upload-pages-artifact`, `deploy-pages`), sem conta nem token extra. O enunciado cita o Pages para aplicações estáticas. |
| Backend | **Render** (serviço web a partir de imagem Docker) | O backend precisa rodar continuamente e receber variáveis de ambiente. O enunciado cita Render para aplicações com backend. Ele aceita uma imagem Docker pronta e oferece um Deploy Hook, que a pipeline chama por HTTP para publicar a nova versão, o que permite automatizar o deploy pelo Actions. |
| Imagem do backend | **Docker Hub** | É a etapa de **Release** vista na aula 08: a pipeline constrói a imagem, a publica com as tags `latest` e o SHA do commit e o Render a baixa. O SHA identifica cada versão publicada e permite voltar a uma versão anterior. A mesma imagem roda em qualquer ambiente, o que reduz o "funciona na minha máquina". |
| Banco | **Neon** (PostgreSQL gerenciado) | O backend usa PostgreSQL, e o teste `contextLoads` precisa de um banco acessível. Um banco gerenciado evita instalar e manter um servidor, serve tanto ao CI quanto ao ambiente publicado e exige apenas as variáveis `DATABASE_*`, guardadas em Secrets. |

## Como a estratégia cumpre o enunciado

- **Automático após push na `main`:** o `cd.yml` é acionado quando o workflow "CI" termina.
- **Somente com a CI concluída com sucesso:** os jobs só rodam se a conclusão da CI for `success` e o evento for `push`. Os jobs seguintes dependem do primeiro e são pulados se ele não executar.
- **Nova versão em ambiente acessível:** o Release publica a imagem, o Render a implanta e o Pages publica o frontend.
- **Fluxo CI → CD → aplicação publicada:** o CD só considera o deploy do backend concluído quando a API responde (health-check em `GET /funcionarios`), e o frontend só é publicado depois disso.

## Cuidados e limitações

- Credenciais ficam só em GitHub Secrets e nas variáveis do Render, nunca no repositório ou na imagem.
- Os planos gratuitos do Render e do Neon podem "adormecer" quando ficam sem uso, o que torna a primeira requisição mais lenta. O health-check do CD tem várias tentativas por esse motivo.
- A CI roda os testes do backend contra o banco real do Neon. Para um ambiente profissional, o ideal seria um banco separado para a CI. Pull requests vindos de forks não recebem os secrets e, portanto, falhariam nesse job.
