
# Subscription Management Backend API

A RESTful API service for managing **Clients**, **Products**, **Subscriptions**, **Invoices**, and **Change Logs**, built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL** (Supabase hosted).

Server runs at:  
`http://localhost:5000/` or as specified in your `.env` file.

---

## 🚀 How to initialise and run

1. Create the .env file (use the .env.example as a reference):
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Generate and apply Prisma schema and optionally seed the database:
```bash
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
```

4. Run the backend:
```bash
node server.js
```

---

## 📦 Client APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/clients?page=1&pageLimit=10` | Fetch paginated list of clients |
| `POST` | `/api/clients` | Create a new client |
| `PUT`  | `/api/clients/:id` | Update a client |
| `DELETE` | `/api/clients/:id` | Delete a client |

### Sample Request Body (POST/PUT)

```json
{
  "name": "John Doe",
  "crmId": "crm-001",
  "domain": "example.com",
  "notes": "VIP client"
}
```

---

## 📦 Product APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/products?page=1&pageLimit=10` | Fetch paginated and filtered list of products |
| `POST` | `/api/products` | Create a new product |
| `PUT`  | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

### Sample Request Body

```json
{
  "name": "Pro Plan",
  "year": 2025,
  "createdBy": "admin",
  "unitPrice": 99.99,
  "unitPeriod": "MONTHLY",
  "description": "Advanced product",
  "notes": "Internal remark"
}
```

---

## 🔗 Subscription APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/subscriptions?page=1&pageLimit=10&status=Active` | Fetch paginated list of subscriptions with filters |
| `GET`  | `/api/subscriptions/:id` | Get subscription by ID |
| `POST` | `/api/subscriptions/client/:clientId` | Create subscription for a client |
| `PUT`  | `/api/subscriptions/:id` | Update a subscription |
| `DELETE` | `/api/subscriptions/:id` | Delete a subscription |

### Sample Request Body

```json
{
  "productId": "uuid-product-id",
  "startDate": "2025-01-01",
  "endDate": "2026-01-01",
  "status": "Active",
  "term": "12 months",
  "discount": 10.0
}
```

---

## 🧾 Invoice APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/invoices?subscriptionId=...&page=1&pageLimit=10` | Get invoices with optional filters |
| `POST` | `/api/invoices` | Create invoice |
| `PUT`  | `/api/invoices/:id` | Update invoice |
| `DELETE` | `/api/invoices/:id` | Delete invoice |

### Sample Request Body

```json
{
  "subscriptionId": "uuid-subscription-id",
  "refNo": "INV-202505",
  "xeroId": "xero-abc-123",
  "amount": 299.99,
  "createdBy": "system",
  "payDate": "2025-06-01",
  "serviceStart": "2025-05-01",
  "serviceEnd": "2025-06-01"
}
```

---

## 🪵 Change Log APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/changelogs?page=1&pageLimit=10&type=Client&action=CREATE_CLIENT` | Get filtered change logs |

---

## 📊 Dashboard Metrics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/dashboard/metrics` | Returns aggregated dashboard metrics |

---

## 📋 Status Codes

| Code | Meaning |
|------|---------|
| `200 OK` | Success |
| `201 Created` | Created |
| `400 Bad Request` | Invalid data |
| `404 Not Found` | Resource missing |
| `500 Internal Server Error` | Unexpected error |

---

## 🌐 Notes

- All date fields are ISO 8601 (`"2025-05-01T00:00:00Z"`)
- All IDs are UUIDs
- Pagination supported with `page` and `pageLimit`
- Response format includes: `page`, `pageLimit`, `total`, `totalPages`, and `itemsInPage`

---

## 📣 Example Base URL for API

```
http://localhost:5000/api/
```
