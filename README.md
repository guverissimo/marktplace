# Sistema de Autenticação Full Stack

Este é um sistema full stack de autenticação de usuários desenvolvido com React, Spring Boot e MySQL.

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security
- JWT
- MySQL
- Maven

### Frontend
- React 18
- TailwindCSS
- Context API
- Axios

## Estrutura do Projeto

```
market/
├── backend/           # Projeto Spring Boot
└── frontend/         # Projeto React
```

## Requisitos

- Java 17 ou superior
- Node.js 18 ou superior
- MySQL 8.0 ou superior
- Maven
- npm ou yarn

## Configuração do Ambiente

### Backend

1. Navegue até a pasta `backend`
2. Configure o arquivo `application.properties` com suas credenciais do MySQL
3. Execute `mvn spring-boot:run`

### Frontend

1. Navegue até a pasta `frontend`
2. Execute `npm install` ou `yarn install`
3. Execute `npm start` ou `yarn start`

## Funcionalidades

- Cadastro de usuários
- Login com JWT
- Proteção de rotas
- Interface responsiva
- Validação de formulários
- Mensagens de feedback 