FROM nginx:latest

RUN apt update && apt upgrade -y

SHELL ["/bin/bash", "--login", "-c"]

WORKDIR /tmp
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN nvm install 20.11.0

COPY ./config/app_nginx.conf /etc/nginx/conf.d/

WORKDIR /var/www/fin-processor-ui.example.org/html

COPY .next/ ./.next
COPY package.json .
COPY package-lock.json .

RUN npm install --omit=dev

EXPOSE 80

CMD export NODE_ENV=production && npm run start & nginx -g "daemon off;"
