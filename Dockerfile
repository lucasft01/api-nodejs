FROM node:10

RUN mkdir -p /home/node/api/

WORKDIR /home/node/api

COPY . .

RUN npm install

EXPOSE 3001

CMD [ "npm", "run", "start" ]
