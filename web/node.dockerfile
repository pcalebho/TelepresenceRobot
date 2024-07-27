# Start with the Node.js base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose necessary port for Node.js
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]
