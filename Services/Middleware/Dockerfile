FROM ubuntu:22.04

## Set up APT 
## Install sudo, curl, and xsel
RUN apt-get update && apt-get install -y wget gnupg2
RUN apt-get install -y sudo curl xsel

## install nodejs lts
RUN cd ~/ && curl -sL https://deb.nodesource.com/setup_lts.x -o setup_18.sh && sh ./setup_18.sh && apt-get install -y nodejs

## Setup a volume for the app
VOLUME /app

## expose the DEV port
EXPOSE 3000

## set the Workdir
WORKDIR /app

## start the dev server
CMD ["bash", "/app/start.bash"]
