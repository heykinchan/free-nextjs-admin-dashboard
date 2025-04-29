# Subscription Management Backend API

A RESTful API service for managing **Clients**, **Products**, and **Subscriptions**, built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL** (Supabase hosted).

Server runs at:  
`http://localhost:5000/` or specified in the .env file

--- 

### How to initialise and run

1. Create the .env file, can use the .env.example as reference
```
cp .env.example .env
```
2. Install dependencies
```
npm install
```

3. Ensure prisma is generated, can run the seed for dummy data
```
npx prisma generate
npx prisma db pull 
```

4. Run the backend
```
node server.js 
```

---

## 📦 Client APIs

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/clients` | Fetch all clients (with their subscriptions and products) |
| `POST` | `/api/clients` | Create a new client |
| `PUT` | `/api/clients/:id` | Update a client’s name and email |
| `DELETE` | `/api/clients/:id` | Delete a client |

### ➡ Request Body (POST `/api/clients`)

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### ➡ Request Body (PUT `/api/clients/:id`)

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

---

## 📦 Product APIs

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/products` | Fetch all products |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Update a product’s name, price, and description |
| `DELETE` | `/api/products/:id` | Delete a product |

### ➡ Request Body (POST `/api/products`)

```json
{
  "name": "Pro Plan",
  "price": 49.99,
  "description": "Access to premium features"
}
```

### ➡ Request Body (PUT `/api/products/:id`)

```json
{
  "name": "Updated Plan",
  "price": 59.99,
  "description": "Updated feature list"
}
```

---

## 🔗 Subscription APIs

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/subscriptions/client/:clientId` | Create a subscription for a client |
| `PUT` | `/api/subscriptions/:id` | Update a subscription's start date, end date, or status |
| `DELETE` | `/api/subscriptions/:id` | Delete a subscription |

### ➡ Request Body (POST `/api/subscriptions/client/:clientId`)

```json
{
  "productId": 2,
  "startDate": "2025-05-01",
  "endDate": "2026-05-01",
  "status": "Active"
}
```

### ➡ Request Body (PUT `/api/subscriptions/:id`)

```json
{
  "startDate": "2025-06-01",
  "endDate": "2026-06-01",
  "status": "Paused"
}
```

---

## 📋 Status Codes

| Status Code | Meaning |
|:---|:---|
| `200 OK` | Successful operation |
| `201 Created` | Successfully created resource |
| `400 Bad Request` | Invalid request parameters |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Server error |

---

# 📌 Notes

- All dates should be formatted as **ISO 8601 strings** (e.g., `"2025-05-01"`).
- All IDs (`clientId`, `productId`, `subscriptionId`) are **integers**.
- Error responses will return a JSON object with an `error` message.
- CORS is enabled for frontend access.

---

# 📣 Example Base URL for API Requests

If backend is running locally:

```
http://localhost:5000/api/
```

---

# 🏁 End of API Documentation
