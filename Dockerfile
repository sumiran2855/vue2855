# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:16-alpine

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Make sure the Vue CLI service is available globally
RUN npm install -g @vue/cli

# Run the web service on container startup.
CMD ["npm", "run", "serve"]
