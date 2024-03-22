#!/bin/bash

cd ..
docker-compose down
docker-compose up --build -d
docker system prune -f
cd backend


