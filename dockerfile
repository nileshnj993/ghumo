# version of image is 16
FROM node:16
# Create app directory in image
RUN mkdir -p usr/src/app
# Directory to be used as working directory
WORKDIR /usr/src/app
# Copy and install app dependencies
COPY package*.json ./

RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 8080
CMD [ "npm", "start" ]