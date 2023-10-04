# TamberAI #
This project is a music creation system that uses metadata from past songs to create viral hits of today.

The project is made up of services, located in the services directory.  Each service is available as a Docker container.  To start all the services in one shot, cd into services and run either "docker compose up" or "sudo docker compose up" depending on your operating system.

You can also individually start a service by typing "docker compose up X, replacing X with the name of the service. 

## FrontEnd ##
This is the react application that serves as the main user interface.

## Middleware ##
This is an express web app that acts as a middle tier component.  It proxies DB and web service calls.

## Backend ##
In here are services that can be behind a message queue or horizontally scaled.  A postgres instance exists in here.

## Resource Map ##
The following resources are reserved for services:

ports:
3000 -- front end service
5001 -- middleware service
5432 -- postgres service