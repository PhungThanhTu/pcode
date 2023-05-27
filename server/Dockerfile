FROM ubuntu:latest
RUN apt-get update && apt-get -y install curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash
RUN apt-get install -y nodejs
RUN npm install pm2@latest -g
WORKDIR /server
COPY ./server/package.json .
RUN npm install
COPY ./server .
EXPOSE 8000
CMD ["npm","run","start "]
