FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG API_BASE_URL=http://localhost:8080
ENV API_BASE_URL=${API_BASE_URL}

RUN npm run build -- --configuration=production

RUN find /app/dist/blindify-frontend/browser -name "*.js" -exec \
    sed -i "s|#{API_BASE_URL}#|${API_BASE_URL}|g" {} \;

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/blindify-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]