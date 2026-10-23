# motoshop-backend

API сервер для интернет-магазина мотоэкипировки и запчастей.

## Стек
- Node.js, Express
- SQLite3
- JWT

## Установка и запуск

1. Установка зависимостей:
```bash
npm install
```

2. Настройка переменных окружения:
Создайте файл `.env` (пример в `.env.example`):
```env
PORT=3000
HOST=localhost
SECRET=jwt_secret_key
```

3. Запуск:
```bash
# dev (с автоперезагрузкой)
npm run dev

# обычный запуск
npm start
```

## Эндпоинты API

- **Авторизация и пользователи:**
  - `POST /register`, `POST /login`
  - `GET /me`, `POST /changeUserData`
  - `GET /admin`, `GET /getUsers`, `POST /delUser` (админ)
- **Товары:**
  - `GET /getProducts`, `GET /getProduct/:id`
  - `POST /createProduct`, `PUT /updateProduct`, `DELETE /deleteProduct` (админ)
- **Заказы:**
  - `POST /makeOrder`, `GET /getOrders`, `POST /updateOrderStatus`
  - `GET /getAllOrders`, `GET /getOrderInfo`, `PATCH /changeOrderStatus`, `DELETE /deleteOrder` (админ)
