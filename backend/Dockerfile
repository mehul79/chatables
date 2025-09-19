FROM node:18-alpine

WORKDIR /app

# Copy package files & install deps (for caching)
COPY package*.json ./
RUN npm install

# utilities used by prisma one-shot and healthchecks
RUN apk add --no-cache netcat-openbsd postgresql-client

# copy source
COPY . .

EXPOSE 3000

# default start command for backend (adjust if your start script is different)
# ensure your dev server binds to 0.0.0.0 so it's reachable from other containers
CMD ["npm", "run", "dev"]
