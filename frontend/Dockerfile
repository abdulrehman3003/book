# Use Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Docusaurus site
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Serve the built site
CMD ["npx", "docusaurus", "serve", "--host", "0.0.0.0", "--port", "3000"]