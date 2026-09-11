#!/bin/sh
set -e

echo "Aguardando o MySQL ficar pronto em ${DB_HOST:-127.0.0.1}:${DB_PORT:-3306}..."
until node -e "
  require('mysql2').createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
  }).connect((err) => process.exit(err ? 1 : 0));
"; do
  sleep 2
done

echo "Rodando migrations..."
npx sequelize db:migrate

echo "Iniciando servidor..."
exec node app.js
