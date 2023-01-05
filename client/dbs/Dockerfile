FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g serve

COPY build ./

EXPOSE 3000

CMD ["serve", "-s"]