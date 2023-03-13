FROM node:slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV production


WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json .

RUN npm install --only=production \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r runner && useradd -r -g runner -G audio,video runner \
    && mkdir -p /home/runner/Downloads \
    && chown -R runner:runner /home/runner \
    && chown -R runner:runner ./node_modules

USER runner

COPY . .

EXPOSE 3000

CMD ["npm", "start"]