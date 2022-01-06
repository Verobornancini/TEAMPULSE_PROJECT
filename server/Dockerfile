  # No bash, can still use once confident
# FROM node:alpine

FROM 280035946601.dkr.ecr.us-east-1.amazonaws.com/node:alpine
RUN npm install -g nodemon

RUN mkdir -p /app/server
WORKDIR /app/server

COPY package*.json /app/server/

RUN npm install

COPY . /app/server/

CMD ["npm", "start"]
#CMD ["nodemon", "index.js"]