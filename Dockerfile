FROM ubuntu:latest
WORKDIR /usr/local/etc/isolate
COPY ./isolate .
RUN apt-get update && apt-get -y install curl && apt-get -y install gcc && apt-get -y install libcap-dev && apt-get install make && apt-get -y install g++
RUN make isolate
ENV PATH="/usr/local/etc/isolate:$PATH"
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash
RUN apt-get install -y nodejs
WORKDIR /server
COPY ./server/package.json .
RUN npm install
COPY ./server .
EXPOSE 8000
CMD ["npm","run","dev"]
