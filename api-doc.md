# Aruto Server

This app has :

- RESTful endpoint for asset's CRUD operation
- JSON formatted response

&nbsp;

Tech Stack used to build this app :

- Node JS
- Express JS framework
- MongoDb

&nbsp;

## Global Responses

> These responses are applied globally on all endpoints

_Response (400 - Bad Request)_

```json
{
  "message": "<Validation error message>"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "<Unauthorize message>"
}
```

_Response (404 - Data not found)_

```json
{
  "message": "Data not found"
}
```

_Response (500 - Internal server error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## RESTful endpoints

### POST /login

> Login user

_Request Header_

```json
not needed
```

_Request Body_

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200)_

```json
{
  "_id": "ObjectId",
  "email": "string",
  "access_token": "string"
}
```

### POST /register

> Register user

_Request Header_

```json
not needed
```

_Request Body_

```json
{
  "full_name": "string",
  "username": "string",
  "email": "string",
  "password": "string"
}
```

_Response (201)_

```json
{
  "_id": "ObjectId",
  "full_name": "string",
  "username": "string",
  "email": "string"
}
```

### POST /arts

> Create arts

_Request Header_

```json
{
  "access_token": "string"
}
```

_Request Body_

```json
{
  "title": "string",
  "image_url": "file",
  "price": "integer",
  "categories": "string"
}
```

_Response (201)_

```json
{
  "_id": "ObjectId",
  "user": {
    "_id": "ObjectId",
    "full_name": "string"
  },
  "title": "string",
  "image_url": "string",
  "price": "integer",
  "likes": "[]",
  "categories": "[ObjectId]"
}
```

### GET /arts

> Get all arts

_Request Header_

```json
not needed
```

_Request Body_

```json
not needed
```

_Response (200)_

```json
[
  {
    "_id": "ObjectId",
    "user": {
      "_id": "ObjectId",
      "username": "string"
    },
    "title": "string",
    "image_url": "string",
    "price": "integer",
    "likes": "[]",
    "categories": "[ObjectId]"
  },
  {
    "_id": "ObjectId",
    "user": {
      "_id": "ObjectId",
      "username": "string"
    },
    "title": "string",
    "image_url": "string",
    "price": "integer",
    "likes": "[]",
    "categories": "[ObjectId]"
  }
]
```

### PUT /arts/:id

> Update all arts's attribute

_Request Header_

```json
{
  "access_token": "string"
}
```

_Request Body_

```json
{
  "title": "string",
  "latestUrl": "string",
  "price": "integer",
  "categories": "[string]"
}
```

_Response (200)_

```json
[
  {
    "message": "Art has been updated"
  }
]
```

### PATCH /arts/:id/like

> Liking art

_Request Header_

```json
{
  "access_token": "string"
}
```

_Request Body_

```json
not needed
```

_Response (200)_

```json
[
  {
    "message": "Art has been liked"
  }
]
```

### DELETE /arts/:id

> Delete arts

_Request Header_

```json
{
  "access_token": "string"
}
```

_Request Body_

```json
not needed
```

_Response (200)_

```json
{
  "message": "Arts deleted succesfully"
}
```

### GET /categories

> Get all category

_Request Header_

```json
not needed
```

_Request Body_

```json
not needed
```

_Response (200)_

```json
[
  {
    "_id": "ObjectId",
    "title": "string",
    "image_url": "string"
  },
  {
    "_id": "ObjectId",
    "title": "string",
    "image_url": "string"
  }
]
```
