if not exist \example mkdir -p \example 
if not exist \cg\memory\ mkdir -p \cg\memory\ 
if not exist \cg\cpuacct\ mkdir -p \cg\cpuacct\ 
docker-compose -f ./docker/dev/docker-compose.yml up -d --build