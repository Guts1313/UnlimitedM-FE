# Stage 0: Build the React app
FROM node:14-alpine as build

WORKDIR /app
ENV HOST 0.0.0.0

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]








