# Sistema de Contratação de Funcionários — PicPay

Sistema web interno para o setor de RH do PicPay gerenciar candidatos em processo
seletivo: cadastrar, consultar, atualizar (completa e parcialmente) e excluir
funcionários.

Projeto desenvolvido como desafio da disciplina **DESENVOLVIMENTO 2**, unindo uma API REST em
Spring Boot com uma interface Front-end em React.

## Sobre o desafio

O backend expõe uma API REST que implementa os cinco métodos HTTP estudados
(POST, GET, PUT, PATCH, DELETE), armazenando os candidatos em memória (`ArrayList`,
sem banco de dados). O Front-end consome essa API para oferecer uma interface
utilizável por qualquer pessoa do RH, sem precisar de Postman ou Insomnia.

**Tecnologia de Front-end escolhida:** React (com Vite), estilizado com CSS puro
(sem framework de CSS).

## Funcionalidades

- Painel com indicadores (total de candidatos, em análise, aprovados,reprovados, contratados)
- Listagem dos últimos candidatos com status
- Distribuição de candidatos por departamento
- Cadastrar candidato (POST)
- Consultar candidato por ID (GET /{id})
- Editar candidato — atualização completa (PUT)
- Atualização parcial (PATCH) 
- Excluir candidato (DELETE)
- Busca por nome, cargo ou status

## Tecnologias

**Backend**
- Java 17+
- Spring Boot
- Spring MVC

**Frontend**
- React + Vite
- CSS puro (variáveis CSS, sem Tailwind/Bootstrap)
- [lucide-react](https://lucide.dev/) para ícones

## Estrutura do repositório

```
sistema-contratacao/
├── backend/      # API Spring Boot (a adicionar)
├── frontend/     # Interface React
└── banco_de_dados/   #script inicial do banco de dados
```

## Como rodar o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (para o frontend)
- [JDK](https://adoptium.net/) 17 ou superior e Maven (para o backend)

### Banco de dados (Postgresql)

Rodar o arquivo `script_completo.sql` em um banco de dados Postgresql.

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

A API sobe por padrão em `http://localhost:8080`.

| Método | Endpoint             | Objetivo                    |
|--------|-----------------------|------------------------------|
| POST   | `/funcionarios`       | Cadastrar funcionário        |
| GET    | `/funcionarios`       | Consultar todos              |
| GET    | `/funcionarios/{id}`  | Consultar por ID             |
| PUT    | `/funcionarios/{id}`  | Atualizar completamente      |
| PATCH  | `/funcionarios/{id}`  | Atualizar parcialmente       |
| DELETE | `/funcionarios/{id}`  | Excluir funcionário          |

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

A interface abre por padrão em `http://localhost:5173`.

> ⚠️ Se o projeto estiver dentro de uma pasta do OneDrive ou com caracteres
> especiais no caminho (espaços, acentos, `&`), o `npm install`/`npm run dev`
> pode falhar. Prefira um caminho simples, ex: `C:\projetos\sistema-contratacao`.

### Build de produção do frontend

```bash
cd frontend
npm run build
```

Gera os arquivos finais na pasta `frontend/dist`.

## Autor
- Davi do Nascimento Costa -> https://github.com/davinc29
- Lorenzo Lima de Oliveira -> https://github.com/LorenzoOliveira-git
- Mariana Marrão Ferreira Felis -> https://github.com/marianamarrao

Projeto acadêmico — disciplina Desenvolvimento, Instituto J&F.