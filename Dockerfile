FROM node:lts

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

EXPOSE 3501

CMD ["npm", "run", "start"]