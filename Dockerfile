# Use the official Node.js image as the base image
FROM node:14-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use the official Nginx image to serve the static files
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]








