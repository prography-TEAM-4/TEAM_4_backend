FROM node:17-alpine
WORKDIR /app
RUN apk --no-cache add curl
COPY package*.json ./
RUN npm install --silent
COPY . .
CMD ["npm","start"]
EXPOSE 3000

