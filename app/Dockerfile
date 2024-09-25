# Use the official Node.js image
FROM node:16-slim

# Set the working directory
WORKDIR /backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the application code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose the app's port
EXPOSE 8080

# Health check (optional)
HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1

# Start the app
CMD ["npm", "start"]
