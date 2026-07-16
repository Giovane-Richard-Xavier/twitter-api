FROM node:20-slim

RUN apt-get update && apt-get install -y openssl bash

WORKDIR /home/node/app

COPY package*.json ./

# instala deps do projeto
RUN npm install

# opcional CLI global
RUN npm install -g @nestjs/cli

COPY . .

RUN npx prisma generate

RUN chmod +x .docker/entrypoint.sh

ENTRYPOINT ["/home/node/app/.docker/entrypoint.sh"]