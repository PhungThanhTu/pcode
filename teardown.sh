docker rm --force isolate-container 
docker rmi $(docker images 'isolate-engine' -a -q)