# syntax=docker/dockerfile:1
FROM node:lts-buster-slim as builder
WORKDIR /app
COPY ./ /app
RUN npm install --save-dev; npm run build; 

FROM node:lts-buster-slim
WORKDIR /app
COPY --from=builder /app /app
RUN npm install;
CMD [ "/usr/local/bin/node", "/app/build/worker.js" ]
