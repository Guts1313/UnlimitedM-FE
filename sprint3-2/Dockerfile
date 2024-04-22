# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and potentially package-lock.json
COPY package*.json ./

# Check if package.json is present
RUN ls -la

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application source code
COPY . .

# List files to verify copy
RUN ls -la

# Build the application
RUN npm run build

# Output for debugging
RUN ls -la /app

# Stage 2: Serve the app with nginx
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
