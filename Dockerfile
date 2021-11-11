# Image comes with npm installed
FROM node:latest

ENV NODE_ENV production

WORKDIR /app
# COPY package-lock.json .
COPY package.json /app/
RUN npm install
RUN npm ci --only=production && npm cache clean --force
RUN npm cache clean --force
COPY . /app/

# RUN npm ci --only=production && npm cache clean --force

# This is the port of the server
EXPOSE 9000

CMD ["npm", "start"]