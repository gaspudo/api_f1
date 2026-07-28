#  🏎️ API F1 🏎️

API REST para gerenciamento de equipes e pilotos de Fórmula 1, desenvolvida com Node.js, TypeScript, Express e Prisma ORM.

##  Tecnologias

- **Node.js** com **TypeScript**
- **Express 5**
- **Prisma ORM**
- **MySQL**
- **Zod** — validação de dados

##  Estrutura do Projeto

```
src/
├── controllers/
│   ├── times.ts       # CRUD de equipes
│   └── pilotos.ts     # CRUD de pilotos
├── routes/
│   ├── times.ts
│   ├── pilotos.ts
│   └── index.ts
├── lib/
│   └── prisma.ts      # instância do Prisma Client
├── utils/
│   └── utils.ts       # schemas Zod e funções utilitárias
└── server.ts
```

##  Instalação

```bash
# Clone o repositório
git clone https://github.com/gaspudo/api_f1.git
cd api_f1

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Execute as migrations do banco
npx prisma migrate dev

# Inicie o servidor
npm run watch
```

##  Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
DATABASE_URL="postgresql://{user}:{senha}@{host}:{porta}/{db}"
DATABASE_USER=SEU_USER
DATABASE_PASSWORD=SUA_SENHA
DATABASE_NAME=SEU_DB
DATABASE_HOST=SEU_HOST
DATABASE_PORT=SUA_PORTA_DO_DB
PORT=PORTA_ONDE_SUA_API_RODA
```

##  Modelo de Dados

```prisma
model Equipe {
  id      Int      @id @default(autoincrement())
  name    String   @unique
  pilotos Piloto[]
}

model Piloto {
  id       Int    @id @default(autoincrement())
  name     String @unique
  ativo    Boolean @default(true)
  equipe   Equipe @relation(fields: [equipeId], references: [id])
  equipeId Int
}
```

##  Endpoints

### Equipes — `/times`

| Método | Rota       | Descrição               |
|--------|------------|-------------------------|
| GET    | `/times`   | Lista todas as equipes  |
| GET    | `/times/:id` | Busca equipe por ID   |
| POST   | `/times`   | Cria uma nova equipe    |
| PUT    | `/times/:id` | Atualiza uma equipe   |
| DELETE | `/times/:id` | Remove uma equipe     |

#### POST `/times` — Body

```json
{
  "name": "Mercedes",
  "pilotos": [
    { "name": "Hamilton" },
    { "name": "Russell" }
  ]
}
```

> O campo `pilotos` é opcional. Se um piloto já existir no banco, ele será vinculado à equipe (`connectOrCreate`).

---

### Pilotos — `/pilotos`

| Método | Rota          | Descrição              |
|--------|---------------|------------------------|
| GET    | `/pilotos`    | Lista todos os pilotos |
| GET    | `/pilotos/:id` | Busca piloto por ID   |
| POST   | `/pilotos`    | Cria um novo piloto    |
| PUT    | `/pilotos/:id` | Atualiza um piloto    |
| DELETE | `/pilotos/:id` | Remove um piloto      |

#### POST `/pilotos` — Body

```json
{
  "name": "Max Verstappen",
  "equipeId": 1
}
```

---

##  Respostas da API

### Sucesso

```json
{ "mensagem": "Time Mercedes criado com sucesso." }
```

### Erro de validação — 400

```json
{ "erro": [{ "message": "O nome é obrigatório", "path": ["name"] }] }
```

### Não encontrado — 404

```json
{ "erro": "Time com id 99 nao encontrado" }
```

### Conflito — 409

```json
{ "erro": "Equipe Mercedes ja existe" }
```

### Erro interno — 500

```json
{ "erro": "Erro interno do servidor" }
```

## 👤 Autor

**João Pedro Gaspar da Silva** — [@gaspudo](https://github.com/gaspudo)