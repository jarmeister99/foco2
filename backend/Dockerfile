
# Step 1: Specify the base image
FROM node:21

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app
COPY . .

# RUN npx prisma db push
RUN npx prisma generate

# Step 6: Build the app (if necessary, e.g., TypeScript)
RUN npm run build


# Step 7: Specify the command to run the app
CMD ["npm", "run", "start:prod"]