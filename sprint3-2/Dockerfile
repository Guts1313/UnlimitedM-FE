WORKDIR /app

# Copy the package.json and package-lock.json files
COPY sprin3-2/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
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



