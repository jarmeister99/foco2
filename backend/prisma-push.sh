#!/bin/bash

npx dotenv -e .env.test -- npx prisma generate
npx dotenv -e .env.test -- npx prisma db push
npx dotenv -e .env.test -- npx prisma db seed