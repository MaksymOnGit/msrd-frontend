### STAGE 1: Build ###
FROM node:14.15.0-alpine AS build
WORKDIR /home/node/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.23.2-alpine
#COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=build /home/node/app/dist/msrdfrontend /usr/share/nginx/html