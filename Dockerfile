FROM node:18
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y ffmpeg
RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node
COPY package*.json ./
RUN npm install
COPY . .
USER node
CMD [ "node", "index.js" ]
