#    Blog Pessoal API - Security

API REST para um blog pessoal com autenticação e segurança, desenvolvida com NestJS, TypeORM e MySQL.

## 📋 Funcionalidades

- CRUD completo de Postagens, Temas e Usuários
- Autenticação JWT com Passport.js
- Relacionamentos entre entidades
- Criptografia de senhas com Bcrypt

## 🔐 Autenticação

Sistema de autenticação JWT que protege rotas sensíveis. O login retorna um token que deve ser enviado no header `Authorization: Bearer <token>` para acessar endpoints protegidos.

**Exemplo de Login:**
```json
POST /usuarios/logar
{
  "usuario": "admin@email.com.br",
  "senha": "admin123"
}
```

## 🗄️ Modelo de Dados

```
tb_usuarios          tb_postagens         tb_temas
├── id               ├── id               ├── id
├── nome             ├── titulo           ├── descricao
├── usuario          ├── texto            
├── senha            ├── data
├── foto             ├── tema_id (FK)
└── postagem[]       └── usuario_id (FK)
```

**Relacionamentos:**
- Um usuário pode ter várias postagens (1:N)
- Um tema pode ter várias postagens (1:N)

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18+)
- MySQL

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd blog

# Instale as dependências
npm install

# Crie o banco de dados no MySQL
CREATE DATABASE db_blogpessoal;

# Execute o projeto
npm run start:dev
```

A API estará disponível em `http://localhost:4000`

## 📝 Endpoints

### Públicos (sem autenticação)
- `POST /usuarios/cadastrar` - Cadastrar usuário
- `POST /usuarios/logar` - Login

### Protegidos (requer token JWT)

**Usuários**
- `GET /usuarios/all` - Listar todos
- `GET /usuarios/:id` - Buscar por ID
- `PUT /usuarios/atualizar` - Atualizar

**Postagens**
- `GET /postagens` - Listar todas
- `GET /postagens/:id` - Buscar por ID
- `POST /postagens` - Criar
- `PUT /postagens` - Atualizar
- `DELETE /postagens/:id` - Deletar

**Temas**
- `GET /temas` - Listar todos
- `GET /temas/:id` - Buscar por ID
- `POST /temas` - Criar
- `PUT /temas` - Atualizar
- `DELETE /temas/:id` - Deletar

## 🧪 Testando

Use o arquivo `requests.http` incluído no projeto com a extensão REST Client do VS Code.

1. Execute o login para obter o token
2. Copie o token retornado
3. Use o token nos endpoints protegidos

## 🛠️ Tecnologias

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT
- Passport.js
- Bcrypt

## 📚 Documentação

- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [Passport.js](http://www.passportjs.org/)

## 📄 Licença

UNLICENSED

---

Desenvolvido durante o Bootcamp Generation Brasil