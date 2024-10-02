FROM node:20.15.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g http-server

EXPOSE 8423

CMD ["http-server", "/app/dist", "-p", "8423"]