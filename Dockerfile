# Use the official Node.js image
FROM node:16-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the application code
COPY . .

# Expose the app's port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
