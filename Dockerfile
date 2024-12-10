# Step 1: Build the Angular app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app using the correct configuration
RUN npm run build --prod  

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the build files from the build stage to Nginx
COPY --from=build /app/dist/booking /usr/share/nginx/html

# Expose port 80 to the host machine
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
