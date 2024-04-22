# Step 1: Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
COPY package*.json ./
# If you are using Yarn, you can copy the yarn.lock file instead
# COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# For Yarn, use:
# RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app (React specific)
RUN npm run build
# For other frameworks, you may have different build commands
# Angular: ng build --prod
# Vue: npm run build

# Step 2: Use serve to serve the static files
# It's a good practice to use a lightweight server for serving static files
# npm install -g serve
# For example, we use serve to serve the static files in a production build
FROM nginx:alpine

# Copy built assets from builder stage to nginx folder
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Command to run the serve module
# Using Nginx, the default command serves files from /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
