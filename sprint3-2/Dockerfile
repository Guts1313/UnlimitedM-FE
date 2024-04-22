# Step 1: Use an official Node.js runtime as a parent image
# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and potentially package-lock.json
COPY package.json package-lock.json* ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]