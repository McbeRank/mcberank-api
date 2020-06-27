FROM node:12

# Create app directory
WORKDIR /usr/src/app

# install app dependency
# Using wildcard for copy both package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Add app sources
COPY . .

# Expose default port
EXPOSE 3500

ENTRYPOINT ["node", "app.js"]
