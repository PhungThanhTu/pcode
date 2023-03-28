#docker rm --force isolate-container 
#docker rmi $(docker images 'isolate-engine' -a -q)
docker-compose -f ./docker/dev/docker-compose.yml down
docker image prune -a