FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY components ./components
COPY features ./features
COPY lib ./lib
COPY pages ./pages
COPY theme ./theme
COPY next.config.mjs .
COPY tsconfig.json .

RUN npm run build

CMD ["npm", "start"]
