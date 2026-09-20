# Nginx como Proxy Reverso com Node.js e MySQL

Este projeto cria uma arquitetura com Docker Compose composta por:

- Nginx atuando como proxy reverso na porta 8080
- Aplicação Node.js processando a lógica de negócio
- Banco de dados MySQL para persistência dos nomes cadastrados

A aplicação insere um novo registro a cada acesso na rota principal e renderiza uma página HTML com a lista de nomes cadastrados.

## Arquitetura

- Porta do Nginx: 8080
- Porta da aplicação Node.js: 3000
- Banco MySQL: db:3306

## Pré-requisitos

- Docker
- Docker Compose

## Clonando o repositório

```bash
git clone git@github.com:cleitonads16/NginxNodeJS.git
cd NginxNodeJS
```

Se você estiver trabalhando localmente em uma pasta com o nome `nginx-node-js`, pode usar:

```bash
cd nginx-node-js
```

## Subindo a aplicação

No diretório do projeto, execute:

```bash
docker compose up -d
```

Ou, em versões antigas do Docker Compose:

```bash
docker-compose up -d
```

## Acesso

Abra no navegador:

```text
http://localhost:8080
```

## Repositório GitHub

- https://github.com/cleitonads16/NginxNodeJS

## Docker Hub

- https://hub.docker.com/r/cleitonads16/nginxnodejs

## Estrutura do projeto

```text
nginx-node-js/
├── docker-compose.yml
├── .gitignore
├── node/
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   ├── nginx.conf
│   └── Dockerfile
└── README.md
```

## Inicialização do repositório local

```bash
cd nginx-node-js
git init
git remote add origin git@github.com:cleitonads16/NginxNodeJS.git
git checkout -b main
```

## Commit e push para o GitHub

```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

## Build e push da imagem da aplicação Node.js para o Docker Hub

```bash
docker build -t cleitonads16/NginxNodeJS:latest ./node
docker tag cleitonads16/NginxNodeJS:latest cleitonads16/NginxNodeJS:1.0.0
docker push cleitonads16/NginxNodeJS:latest
docker push cleitonads16/NginxNodeJS:1.0.0
```

## Observações

- O Node.js aguarda a disponibilidade do MySQL antes de iniciar.
- O volume `./node` está montado para facilitar o desenvolvimento.
- A tabela `people` é criada automaticamente se não existir.
- Cada acesso gera um novo registro na tabela `people`.
