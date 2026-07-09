FROM node:20-alpine3.16

WORKDIR /app

COPY package*.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY nodemon.json .
COPY .env.development .
COPY prisma .
COPY doc-api.yaml .
COPY ./src ./src

RUN apk add python3
RUN npm install
RUN npm run prisma:generate
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
