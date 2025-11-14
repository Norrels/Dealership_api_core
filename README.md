# API de Gerenciamento de Veículos

API RESTful para gerenciamento de veículos construída com princípios de Clean Architecture, implementando padrões abrangentes de design orientado a domínio e arquitetura hexagonal.

## Visão Geral da Arquitetura

Este projeto segue os princípios da Clean Architecture com clara separação de responsabilidades em três camadas principais:

### Camada de Domínio
A camada mais interna contendo a lógica de negócio e regras empresariais.

- **Entidades**: Objetos de negócio fundamentais (`Vehicle`)
- **Portas**: Interfaces definindo contratos para dependências externas (`VehicleRepository`)

### Camada de Aplicação
Orquestra o fluxo de dados e implementa os casos de uso.

- **Serviços**: Implementação da lógica de negócio (`VehicleService`)
- **Controladores**: Manipuladores de requisições HTTP (`VehicleController`)
- **DTOs**: Objetos de transferência de dados para validação de requisições/respostas
- **Erros**: Definições de erros customizados para exceções de domínio
- **Middlewares**: Preocupações transversais (logging, tratamento de erros)

### Camada de Infraestrutura
Lida com preocupações externas e detalhes técnicos.

- **Banco de Dados**: Integração PostgreSQL via Drizzle ORM
- **Adaptadores de Repositório**: Implementações concretas das portas de domínio
- **Schemas**: Definições de tabelas do banco de dados

## Stack Tecnológica

- **Runtime**: Bun v1.2+
- **Framework**: Elysia (Framework web TypeScript de alta performance)
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validação**: TypeBox (via Elysia)
- **Logging**: Pino
- **Testes**: Bun Test com cobertura de 95%+

## Estrutura do Projeto

```
src/
├── domain/
│   ├── entities/          # Entidades de negócio
│   └── ports/             # Interfaces de repositório
│
├── application/
│   ├── service/           # Orquestração da lógica de negócio
│   ├── controller/        # Manipuladores de requisições HTTP
│   ├── dtos/              # Objetos de transferência de dados
│   ├── errors/            # Exceções de domínio
│   └── middlewares/       # Preocupações transversais
│
├── infra/
│   ├── database/          # Conexão e schemas do banco
│   └── repository/        # Implementações de repositório
│
├── config/                # Configuração da aplicação
│
└── tests/
    ├── factories/         # Factories de dados de teste
    ├── helpers/           # Utilitários de teste
    └── integration/       # Testes de integração
```

## Padrões de Design

### Arquitetura Hexagonal (Portas e Adaptadores)
- **Portas**: Definidas em `domain/ports` como interfaces
- **Adaptadores**: Implementados em `infra/repository` para sistemas externos

### Padrão Repository
Abstrai o acesso a dados através de interfaces, permitindo que a camada de domínio permaneça independente dos detalhes de persistência.

### Injeção de Dependência
Os serviços recebem suas dependências através de injeção no construtor, permitindo baixo acoplamento e testabilidade.

## Endpoints da API

### Operações Principais

- `POST /vehicles` - Criar um novo veículo
- `GET /vehicles/:id` - Recuperar detalhes do veículo
- `GET /vehicles` - Listar todos os veículos (com filtro opcional de status)
- `PATCH /vehicles/:id` - Atualizar informações do veículo
- `POST /vehicles/:id/sold` - Marcar veículo como vendido
- `POST /webhook/vehicle-status` - Atualizar status do veículo via webhook

### Documentação OpenAPI

Documentação interativa da API disponível no endpoint `/openapi`.

## Configuração de Ambiente

Variáveis de ambiente necessárias:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
PORT=3000
LOG_LEVEL=info  # debug | info | warn | error | silent
```

## Scripts

```bash
# Desenvolvimento
bun run dev              # Iniciar servidor de desenvolvimento com hot reload

# Testes
bun test                 # Executar todos os testes
bun test:watch          # Executar testes em modo watch
bun test:coverage       # Gerar relatório de cobertura

# Banco de Dados
bun run db:push         # Aplicar mudanças de schema no banco
bun run db:studio       # Abrir interface GUI do Drizzle Studio
```

## Garantia de Qualidade

### Qualidade do Código
- TypeScript em modo strict habilitado
- Segurança de tipos abrangente
- Formatação consistente de código

### Logging
- Logging JSON estruturado via Pino
- IDs de correlação para rastreamento de requisições
- Diferentes níveis de log por ambiente
- Hooks de monitoramento de performance