FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install nodemon

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["npm","start"]


