FROM node:14-alpine as builder

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn

# Bundle app source
COPY . /usr/src/app
COPY .env.prod /usr/src/app/.env

RUN yarn build

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
