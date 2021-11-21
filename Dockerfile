FROM node:16.13.0-alpine3.14


WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install
COPY . /app/

# if at least one test fails it will crash the build
RUN npm test

RUN npm ci --production
RUN npm cache clean --force

EXPOSE 9000

# RUN wget http://download.redis.io/redis-stable.tar.gz
# RUN tar xvzf redis-stable.tar.gz
# RUN cd redis-stable
# RUN apt-get install -y redis-server
# RUN redis-server
# RUN cd ..

CMD ["npm", "start"]