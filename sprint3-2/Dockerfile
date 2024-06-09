# Use an official Node runtime as a parent image
FROM node:14-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files from the sprin3-2 directory
COPY sprin3-2/package*.json ./

# Install dependencies
RUN npm install

# Copy all other files from the sprin3-2 directory
COPY sprin3-2/ .

# Build the React app
RUN npm run build

# Use an official Nginx image to serve the built app
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]




