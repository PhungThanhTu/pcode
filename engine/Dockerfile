FROM ubuntu:18.04
WORKDIR /usr/local/etc/isolate
COPY ./engine/isolate .
RUN apt-get update && apt-get -y install curl && apt-get -y install gcc && apt-get -y install libcap-dev && apt-get install make && apt-get -y install g++
RUN apt-get update && apt-get install -y cgroup-tools
RUN make isolate
ENV PATH="/usr/local/etc/isolate:$PATH"
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash
RUN apt-get install -y nodejs
RUN npm install pm2@latest -g
WORKDIR /engine
COPY ./engine/package.json .
RUN npm install
COPY ./engine .
CMD ["npm", "run", "start"]
