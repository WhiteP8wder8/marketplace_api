# Marketplace API

REST API for a marketplace built with [NestJS](https://nestjs.com/) using TypeScript and PostgreSQL.

## Table of Contents
- [Marketplace API demo](#api-demo)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [License](#license)

---

## API Demo

The following demo shows:
- application startup
- authentication flow
- protected endpoints
- basic CRUD operations

POST /authentication/sign-Up
{
  "name": "TestName",
  "email": "user@mail.com",
  "password": "secret"
}

POST /authentication/sign-In
{
  "email": "user@mail.com",
  "password": "secret"
}

{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

---

## Installation

Clone the repository:

```bash
git clone https://github.com/WhiteP8wder8/marketplace_api.git
cd marketplace_api
```
Install dependencies:
```bash
npm install
```
Create a .env file based on .env.example and configure database connection, JWT secret, and other variables.

---

## Running the Project

Start in development mode:
```bash
npm install -g @nestjs/cli
nest start --watch
```
or
```bash
npm run start:dev
```
Build and run for production:
```bash
node dist/main
```

---

## Project Structure

src/
├─ cart/            # Cart module
├─ categories/      # Categories module
├─ iam/             # Authentication and authorization with JWT
├─ products/        # Products module
├─ users/           # Users module
├─ main.ts          # Entry point

---

## Technologies Used

NestJS

TypeScript

PostgreSQL

TypeORM

JWT

Bcrypt

class-validator

Swagger

---

## API Endpoints

Users
| Method | Route      | Description                   |
| ------ | ---------- | ----------------------------- |
| GET    | /users     | Get all users                 |
| GET    | /users/me  | Get the authenticated user    |
| PATCH  | /users/:id | Update user as admin          |
| PATCH  | /users/me  | Update the authenticated user |
| DELETE | /users/:id | Delete a user                 |


Authentication
| Method | Route                          | Description                  |
| ------ | ------------------------------ | ---------------------------- |
| POST   | /authentication/sign-Up        | Create a new account         |
| POST   | /authentication/sign-In        | Login to an existing account |
| POST   | /authentication/refresh-tokens | Refresh JWT token            |

Products
| Method | Route                    | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | /products                | Get all products                |
| GET    | /products/filter         | Get products with query filters |
| GET    | /products/:id            | Get a product by ID             |
| PATCH  | /products/:id            | Update a product by ID (admin)  |
| POST   | /products/create-product | Create a new product            |
| POST   | /products/wishlist/:id   | Add product to wishlist         |
| DELETE | /products/:id            | Delete a product by ID          |
| DELETE | /products/wishlist/:id   | Remove product from wishlist    |


Categories
| Method | Route           | Description                    |
| ------ | --------------- | ------------------------------ |
| GET    | /categories     | Get all categories             |
| GET    | /categories/:id | Get a category by ID           |
| PATCH  | /categories/:id | Update category as admin by ID |
| POST   | /categories     | Create a category (admin)      |
| DELETE | /categories/:id | Delete a category (admin)      |

Cart
| Method | Route     | Description                      |
| ------ | --------- | -------------------------------- |
| GET    | /cart     | Get all products in cart         |
| POST   | /cart     | Add product to cart              |
| DELETE | /cart     | Delete all products from cart    |
| DELETE | /cart/:id | Delete a product by ID from cart |

For detailed API documentation, visit Swagger UI at: http://localhost:3000/api

---

## Authentication & Authorization

JWT-based authentication

/authentication/sign-Up and /authentication/sign-In endpoints

Protected routes use AuthGuard and role-based checks

---

## License

MIT License




