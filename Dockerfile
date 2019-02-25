FROM node:10
MAINTAINER Philipp Klein (philipp@apeunit.com)

WORKDIR /usr/src/code

COPY package*.json ./

RUN npm config set engine-strict true && npm install -g npm@6.8.0 && npm install

COPY . .

ENTRYPOINT ["node", "initial-balances-generator-etherscan.js"]
