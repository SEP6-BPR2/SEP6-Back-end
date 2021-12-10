FROM node:16.13.0-alpine3.14

WORKDIR /app

# Intended to be run from the directory where index.js is
COPY package.json /app/
COPY package-lock.json /app/

RUN npm install
COPY . /app/

# if at least one test fails it will crash the build
RUN npm test

RUN npm ci --production
RUN npm cache clean --force

EXPOSE 9000

CMD ["npm", "start"]