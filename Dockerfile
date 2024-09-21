FROM node:20-alpine

WORKDIR /src

COPY package.json ./
COPY .npmrc ./

RUN npm install -verbose

COPY . .

RUN npm publish