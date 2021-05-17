FROM node:lts-alpine As development

WORKDIR app

ENV NODE_ENV development

COPY package.json yarn.lock ./

RUN yarn --only=development

COPY . .

RUN npm run build
