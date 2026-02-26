# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps \
 && npm rebuild rollup

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]