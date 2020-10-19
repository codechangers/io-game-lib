
FROM node:10

RUN mkdir -p /code
WORKDIR /code

COPY . /code
WORKDIR /code/client
RUN npm install
WORKDIR /code/server
RUN npm install
WORKDIR /code
RUN npm install

EXPOSE 3000

RUN npm run build
CMD [ "npm", "start" ] 
