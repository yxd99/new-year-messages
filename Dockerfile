FROM node:22-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    tzdata \
    && rm -rf /var/cache/apk/*

ENV TZ=America/Bogota
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN mkdir -p /app/whatsapp-session

EXPOSE 3000

CMD ["pnpm", "start:dev"]
