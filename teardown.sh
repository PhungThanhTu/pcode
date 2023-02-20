#docker rm --force isolate-container 
#docker rmi $(docker images 'isolate-engine' -a -q)
docker-compose -f ./docker-compose.yml down
docker image prune -a