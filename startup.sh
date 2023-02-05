docker build -t isolate-engine .
docker run -it --privileged -p 8000:8000 --name isolate-container -v $(PWD)/example:/usr/local/etc/isolate/example/ -v $(PWD)/server:/server isolate-engine