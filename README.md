# Cadastro de Produtos

![CI](https://github.com/Carolaynebarret/estoque-triggers-mysql/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white)
![Top Language](https://img.shields.io/github/languages/top/Carolaynebarret/estoque-triggers-mysql)
![License](https://img.shields.io/github/license/Carolaynebarret/estoque-triggers-mysql)
![Last Commit](https://img.shields.io/github/last-commit/Carolaynebarret/estoque-triggers-mysql)

Projeto acadêmico da disciplina de Banco de Dados, com foco no uso de **triggers/procedures em MySQL** para automatizar regras de negócio: aplicação web para controle de estoque de uma pequena loja, com cadastro de produtos e fornecedores, registro de vendas e reposição automática de estoque disparada por uma trigger no banco quando a quantidade de um produto fica abaixo do limite mínimo. O backend expõe uma API REST em Node.js/Express sobre MySQL (via Sequelize) e o frontend é uma SPA em React que consome essa API.

## Funcionalidades

- Cadastro de produtos (nome, quantidade, descrição, categoria, preço, datas de fabricação/vencimento e fornecedor).
- Listagem de produtos em tabela.
- Remoção de produtos.
- Registro de vendas (quantidade, data, preço e produto vendido).
- Listagem de vendas em tabela.
- Listagem de fornecedores e de compras.
- Reposição automática de estoque: uma trigger/procedure no banco de dados registra uma compra automática e ajusta a quantidade do produto sempre que uma venda deixa o estoque abaixo de um limite mínimo.

> Não há autenticação de usuário nem telas de cadastro/edição de fornecedores ou de compras — apenas o que está listado acima existe hoje no código.

## Tecnologias utilizadas

**Backend**
- Node.js + Express
- Sequelize (ORM) + MySQL (via `mysql2`)
- `sequelize-cli` para migrations
- `dotenv` para variáveis de ambiente
- `cors`, `body-parser`

**Frontend**
- React 18 + React Router
- Ant Design (`antd`)
- Axios

**Infraestrutura**
- Docker / Docker Compose (sobe o app inteiro: banco, API e frontend)
- GitHub Actions (CI: valida build do backend/frontend e roda as migrations a cada push)

## Como executar

### Opção 1 — Docker (recomendado, um único comando)

Pré-requisito: Docker e Docker Compose.

```bash
docker compose up --build
```

Isso sobe três serviços: MySQL (com as migrations e a trigger de reposição de estoque já aplicadas automaticamente no boot), a API Express em `http://localhost:8081` e o frontend React em `http://localhost:3000`.

### Opção 2 — Manual

#### Pré-requisitos

- Node.js 18+ e npm
- Docker e Docker Compose (para subir só o banco MySQL local)

#### Backend

```bash
# na raiz do projeto
npm install

# suba o banco de dados MySQL
docker compose up -d db

# copie o arquivo de variáveis de ambiente e ajuste se necessário
cp .env.example .env

# rode as migrations
npm run db:migrate

# inicie a API (porta 8081 por padrão)
npm start
# ou, em modo desenvolvimento com reload automático:
npm run start:dev
```

#### Variáveis de ambiente

As variáveis usadas pelo backend estão documentadas em [`.env.example`](.env.example):

| Variável      | Descrição                              | Padrão      |
| ------------- | --------------------------------------- | ----------- |
| `DB_HOST`     | Host do MySQL                           | `127.0.0.1` |
| `DB_PORT`     | Porta do MySQL                          | `3306`      |
| `DB_USER`     | Usuário do MySQL                        | `user`      |
| `DB_PASSWORD` | Senha do MySQL                          | `password`  |
| `DB_NAME`     | Nome do banco de dados                  | `db`        |
| `PORT`        | Porta em que a API Express sobe         | `8081`      |

Os valores padrão acima correspondem ao `docker-compose.yml` incluso no projeto (uso local/desenvolvimento apenas).

#### Frontend

```bash
cd client
npm install
npm start
```

A aplicação React sobe em `http://localhost:3000` e consome a API em `http://localhost:8081` (configurado em `client/src/services/api.service.js`).

Para gerar o build de produção do frontend:

```bash
cd client
npm run build
```

## Como rodar os testes

O projeto ainda não possui suíte de testes automatizados, nem no backend nem no frontend (os scripts `npm test` de ambos os projetos são apenas placeholders/padrão do Create React App). Fica registrado no roadmap abaixo.

O CI (`.github/workflows/ci.yml`) cobre o que dá pra validar sem uma suíte de testes: instala as dependências, builda o frontend e sobe o backend de verdade contra um MySQL real, rodando as migrations (incluindo a trigger) e checando se a API responde em `/products`.

## Estrutura de pastas

```
.
├── app.js                  # Entry point da API Express
├── config/                 # Configuração do Sequelize (lê variáveis de ambiente)
├── controllers/            # Lógica das rotas (products, vendors, sales, purchases)
├── routes/                 # Definição das rotas Express
├── models/                 # Modelos Sequelize
├── database/
│   ├── migrations/         # Migrations do sequelize-cli
│   └── scripts/            # Scripts SQL usados pelas migrations (triggers/procedures)
├── Dockerfile               # Imagem do backend
├── docker-entrypoint.sh     # Aguarda o MySQL, roda migrations e inicia a API
├── docker-compose.yml       # Orquestra banco + backend + frontend
├── .github/workflows/ci.yml # Pipeline de CI (build + validação end-to-end)
├── client/                  # Frontend React (SPA)
│   ├── Dockerfile           # Build do frontend servido via nginx
│   └── src/
│       ├── pages/           # Telas (Produtos, Vendas)
│       ├── components/      # Formulários (FormProduct, FormSale)
│       └── services/        # Chamadas HTTP à API (axios)
└── docs/images/              # Screenshots do projeto (ver docs/images/README.md)
```

## Roadmap

- **Autenticação e autorização na API** (achado de segurança pendente): hoje nenhuma rota exige autenticação — qualquer cliente pode criar, listar ou apagar produtos e vendas via `POST`/`DELETE` sem nenhuma credencial. Não há, no projeto atual, nenhuma infraestrutura de usuários/sessão/JWT sobre a qual apoiar uma correção segura; implementar algo parcial (ex.: uma chave fixa hardcoded) criaria uma falsa sensação de segurança. Recomenda-se desenhar um mecanismo real (JWT ou API key gerenciada) como próximo passo antes de expor esta API publicamente.
- Validação de payload nas rotas de criação (`POST /products`, `POST /sales`) — atualmente os controllers confiam nos campos enviados pelo cliente sem validação de tipo/obrigatoriedade no backend.
- Tela de cadastro/edição de fornecedores e de compras (hoje só há listagem via API, sem UI).
- Edição de produtos e vendas (hoje só é possível criar e, no caso de produtos, remover).
- Suíte de testes automatizados (unitários para controllers/models no backend, testes de componente no frontend).
- Capturar e adicionar os screenshots pendentes em `docs/images/` (ver `docs/images/README.md`).

## Contribuição

1. Faça um fork deste repositório.
2. Crie uma branch para a sua alteração: `git checkout -b minha-feature`.
3. Faça commit das suas mudanças com uma mensagem descritiva.
4. Abra um Pull Request explicando o que foi alterado e por quê.

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.
