FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app /app

ENV METRICS_PORT=9137

EXPOSE 9137

CMD [ "node", "src/index.mjs" ]