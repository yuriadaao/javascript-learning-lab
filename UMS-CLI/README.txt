# UMS-CLI

User Management System desenvolvido em Node.js utilizando interface CLI.

## Status

🚧 Em desenvolvimento

## Versão Atual

### v0.4

- Persistência com JSON
- CRUD completo de usuários
- Login e Logout
- Perfil de usuário
- Edição de perfil
- Verificação de perfil
- Exclusão de usuários
- Sistema de busca por:
  - Nome
  - Mês de aniversário
  - Gênero
  - Endereço
- Sistema de doações
  - Realizar Doação
  - Acessar Hístorico
  - Última transação
- Sistema de navegação por páginas
- Header dinâmico
- Controle de sessão através de currentUser

## Histórico de Versões

### v0.1

- Cadastro de usuários
- Login
- Persistência em JSON

### v0.2

- CRUD completo de usuários
- Perfil de usuário
- Edição de perfil
- Exclusão de usuários
- Header dinâmico

### v0.3

- Sistema de busca e filtros
- Busca por nome
- Busca por gênero
- Busca por endereço
- Busca por mês de aniversário
- Tela de resultados
- Contagem de resultados encontrados

### v0.4
- Implementação interface de Doação 
- Doação valida somente multiplos de 10.
- Lista de todas as doações (salva database & entrega em inferface)
- Acessar e repetir última Transação
- Implementação de Total de doações

## Funcionalidades

- Cadastro de usuários
- Login e Logout
- Persistência de dados em JSON
- Perfil de usuário
- Edição de perfil
- Verificação de integridade do perfil
- Exclusão de usuários
- Busca por usuários
- Sistema de navegação por páginas
- Header dinâmico com informações do usuário
- Controle de sessão através de currentUser

## Estrutura do Usuário

Cada usuário possui:

- id
- fullName
- birthDate
- gender
- adress
- email
- password
- plan
- role
- donations
- fullProfile

## Tecnologias

- JavaScript
- Node.js
- Readline
- File System (fs)

## Aprendizados

Durante o desenvolvimento deste projeto foram praticados:

- CRUD
- Manipulação de Arrays
- Métodos de Alta Ordem (find, filter, map, reduce)
- Persistência com File System
- Estruturação de fluxo em aplicações CLI
- Validação de dados com Regex
- Controle de estado da aplicação
- Organização e separação de responsabilidades

## Objetivo

Projeto desenvolvido para praticar:

- CRUD
- Persistência de dados
- Arquitetura de aplicações
- Validações
- Manipulação de arquivos

## Próximas Implementações

- Permissões básicas (Admin / Manager / User)
- Controle de acesso às buscas
- Refinamentos de interface
- Documentação final
- Publicação no LinkedIn