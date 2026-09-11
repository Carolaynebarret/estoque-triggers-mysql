FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

ENTRYPOINT ["./docker-entrypoint.sh"]
