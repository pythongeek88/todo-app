# Use an official Node.js runtime as a base image
FROM node:16.16.0

# Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY todoapp/package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY todoapp/ .

# Make port 3000 available to the outside world
EXPOSE 3000

# Run the application when the container launches
CMD [ "npm", "run", "dev" ]
