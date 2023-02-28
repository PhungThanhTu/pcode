#!/bin/bash
# docker build -t isolate-engine .
# docker run --privileged -p 8000:8000 --name isolate-container -v $(PWD)/example:/usr/local/etc/isolate/example/ -v $(PWD)/server:/server isolate-engine
mkdir -p example
mkdir -p cg/memory
mkdir -p cg/cpuacct
docker-compose -f ./docker-compose.yml up -d --build