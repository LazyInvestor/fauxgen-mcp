# Glama / local MCP container — starts and answers stdio introspection.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY dist ./dist
COPY cli.js ./

ENV NODE_ENV=production

# MCP over stdio (Glama introspection)
CMD ["node", "dist/index.js"]
