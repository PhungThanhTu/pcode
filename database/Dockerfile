FROM mcr.microsoft.com/azure-sql-edge:latest
WORKDIR /var/lib/apt/lists/partial
WORKDIR /setup
WORKDIR /app
COPY /database/app .
RUN apt-get update
USER root
RUN apt-get install -y gcc g++ make
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs
RUN npm install
RUN node setup.js