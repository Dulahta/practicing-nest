# Blog API

A NestJS blog API with JWT authentication, refresh tokens, public post reading, authenticated post creation, and owner-only post editing/deletion.

## Features

- user registration
- user login with `accessToken` and `refreshToken`
- token refresh flow
- connected user profile endpoint
- public blog post listing and post details
- authenticated post creation
- owner-only post update and delete
- PostgreSQL persistence with TypeORM
- Swagger UI for interactive API documentation

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Passport + JWT
- `bcrypt`
- `class-validator`
- `class-transformer`
- Swagger via `@nestjs/swagger`

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

### Profile

- `GET /profile`

### Posts

- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PATCH /posts/:id`
- `DELETE /posts/:id`

## Authentication Model

This project uses two JWT types:

- access token
  - used for protected resource endpoints like `/profile` and write operations on `/posts`
  - expires in 15 minutes
- refresh token
  - used only for `POST /auth/refresh`
  - expires in 7 days

When a user logs in:

1. the API verifies the username and password
2. it returns both tokens
3. it stores a hashed version of the refresh token in the database

When `/auth/refresh` is called:

1. the refresh token is read from the `Authorization` header
2. the token signature is verified
3. the stored hashed refresh token is checked
4. a new access token and a new refresh token are issued

## Ownership Rules

- anyone can read posts
- only authenticated users can create posts
- only the author of a post can update it
- only the author of a post can delete it

If a different authenticated user tries to update or delete someone else's post, the API returns `403 Forbidden`.

## Prerequisites

Install these before running the project:

- Node.js
- npm
- PostgreSQL

## Database Setup

Create the database:

```sql
CREATE DATABASE "blog";
```

Current local database configuration is hardcoded in [src/app.module.ts](C:/Dev/Learn/NestJS/practicing-nest/blog/src/app.module.ts#L8):

- host: `localhost`
- port: `5432`
- username: `postgres`
- password: `admin`
- database: `blog`

## Installation

From the `blog` directory:

```bash
npm install
```

## Running The App

### Development

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
npm run start:prod
```

## Swagger Docs

When the server is running locally, open:

```text
http://localhost:3000/docs
```

Swagger is configured in [src/main.ts](C:/Dev/Learn/NestJS/practicing-nest/blog/src/main.ts#L1) and documents all auth, profile, and post endpoints.

## Example Requests

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_dev",
  "password": "Password123"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_dev",
  "password": "Password123"
}
```

Example response:

```json
{
  "accessToken": "your-access-token",
  "refreshToken": "your-refresh-token"
}
```

### Refresh Tokens

```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

### Get Connected Profile

```http
GET /profile
Authorization: Bearer <access_token>
```

### Create Post

```http
POST /posts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "My first NestJS blog post",
  "content": "This is my first post."
}
```

### Update Post

```http
PATCH /posts/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated title"
}
```

### Delete Post

```http
DELETE /posts/:id
Authorization: Bearer <access_token>
```

## Validation Rules

### Auth credentials

- `username`
  - required
  - string
  - 4 to 20 characters
  - letters, numbers, dots, underscores, and hyphens only
- `password`
  - required
  - string
  - 8 to 32 characters
  - must include uppercase, lowercase, and a number

### Post creation

- `title`
  - required
  - non-empty
  - max length `150`
- `content`
  - required
  - non-empty

### Post update

- `title`
  - optional
  - if sent, must be non-empty
  - max length `150`
- `content`
  - optional
  - if sent, must be non-empty
- at least one field must be provided

## Common Response Statuses

- `200 OK`
  - successful login
  - successful refresh
  - successful reads and updates
- `201 Created`
  - successful register
  - successful post creation
- `204 No Content`
  - successful post deletion
- `400 Bad Request`
  - DTO validation failed
  - update body is empty
- `401 Unauthorized`
  - invalid credentials
  - missing or invalid token
- `403 Forbidden`
  - authenticated user is not the post owner
- `404 Not Found`
  - requested post does not exist
- `409 Conflict`
  - username already exists

## Project Structure

```text
src/
  main.ts
  app.module.ts
  common/
    interceptors/
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    profile.controller.ts
    user.entity.ts
    users.repository.ts
    guards/
    strategies/
    dto/
  posts/
    posts.module.ts
    posts.controller.ts
    posts.service.ts
    posts.repository.ts
    post.entity.ts
    guards/
    dto/
```

## Notes

- database credentials and JWT secrets are currently hardcoded for local learning
- `synchronize: true` is enabled for convenience during development
- for a production-ready version, move secrets and database config to environment variables and use migrations instead of automatic schema sync
