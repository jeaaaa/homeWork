FROM node:alpine3.14


RUN mkdir -p /data

COPY node_modules /data/node_modules
COPY routers /data/routers
COPY app.js /data/
COPY package.json /data/

WORKDIR /data

EXPOSE 3000

CMD [ "node",  "app.js" ]