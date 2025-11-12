FROM node:20-alpine

WORKDIR /app

COPY package*.json yarn.lock* ./

RUN yarn install || npm install

COPY . .

RUN yarn global add expo-cli

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["npx", "expo", "start", "--tunnel"]