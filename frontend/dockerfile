# ==========================================
# Этап 1: Сборка приложения (Build Stage)
# ==========================================
FROM node:20-alpine AS build

# Задаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем все остальные файлы проекта
COPY . .

# Собираем проект (результат появится в папке /app/dist)
RUN npm run build


# ==========================================
# Этап 2: Раздача статики (Production Stage)
# ==========================================
FROM nginx:alpine

# Удаляем дефолтные файлы Nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем собранные файлы из первого этапа в папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем наш кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем 80 порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]