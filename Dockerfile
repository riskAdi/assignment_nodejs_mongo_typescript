FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
EXPOSE 8800
CMD [ "npm", "run", "start.dev" ]