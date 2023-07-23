if not exist \example mkdir \example 
if not exist \cg\memory\ mkdir \cg\memory\ 
if not exist \cg\cpuacct\ mkdir \cg\cpuacct\ 
docker-compose -f ./docker/dev/docker-compose.win64.yml up -d --build
docker exec -it mssql node setup.js