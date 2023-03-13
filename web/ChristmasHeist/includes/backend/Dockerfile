FROM node:alpine

ENV NODE_ENV production

WORKDIR /user/src/app

COPY package*.json .

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]