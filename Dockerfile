FROM node:lts AS builder

COPY . .

RUN npm install
RUN npm run build