# NodeJSMongoDocker
A simple application that gets its data (movies _with /movies_ and characters _with /people_) from an API, and is deployable with a Mongo database on Docker using the command "docker-compose up" thanks to the file **docker-compose.yml**.  

Once the app is started on docker, you can add movies or characters to your favorites and visualize them on the /favorites page.  

## Steps
 - Pull the latest image of mongo from docker.
 - Build the image of the nodeJS app using the command _docker build -t networks-setup ._
 - Run the command _docker-compose up_
