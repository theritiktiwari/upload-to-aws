# Upload Image on AWS S3 Bucket

This is a basic application to upload image on AWS S3 Bucket, after it will show the images to the user who upload it.

## For Developers

- In the root directory of the project, run `yarn install` OR `npm install` to install all the dependencies.
- After that create a `.env` file in the root directory of the project and add the variables mentioned in `.env.example`.

```bash
PORT=
DATABASE_URI=
MAIL_USER=
MAIL_PASS=
MAIL_SENDER_NAME=
WEBSITE_HOST=
JWT_SECRET_KEY=
AWS_ID=
AWS_SECRET_KEY_ID=
AWS_BUCKET_NAME=
AWS_REGION_NAME=
```

- Run `yarn dev` OR `npm dev` to start the development server.
- Import the [Requests.json](./Requests.json) file in Thunder client or Postman to test the APIs or you can do it manually.

### New User Registration

- API Endpoint: `http://127.0.0.1:5000/api/register`
- Run the API with POST method and pass the following data in the **body**.

**Request**

```json
{
  "firstname": "Dummy",
  "lastname": "User",
  "email": "abc@gmail.com",
  "password": "12345678",
  "age": 20,
  "city": "Your city"
}
```

<br/>

**Response**

```json
{
  "type": "success",
  "message": "Account created successfully, please verify your account.",
  "data": "token"
}
```

### Verify User Account

- API Endpoint: `http://127.0.0.1:5000/api/verify`
- Get the code and ID from the email.
- Run the API with POST method and pass the following data in the **body**.

**Request**

```json
{
  "code": "your_code",
  "user_id": "your_id"
}
```

<br />

**Response**

```json
{
  "type": "success",
  "message": "Account verified successfully."
}
```

### Login

- API Endpoint: `http://127.0.0.1:5000/api/login`
- Run the API with POST method and pass the following data in the **body**.

**Request**

```json
{
  "email": "abc@gmail.com",
  "password": "12345678"
}
```

<br />

**Response**

```json
{
  "type": "success",
  "message": "User autheticated successfully.",
  "data": "token"
}
```

### Get User Profile

- API Endpoint: `http://127.0.0.1:5000/api/getuser`
- Run the API with POST method and pass the following data in the **header**.

**Request**

```json
{
  "auth-token": "token"
}
```

<br />

**Response**

```json
{
  "type": "success",
  "message": "User details fetched successfully.",
  "data": {
    "_id": "<user-id>",
    "firstname": "<user-firstname>",
    "lastname": "<user-lastname>",
    "email": "<user-email>",
    "age": "<user-age>",
    "city": "<user-city>",
    "verificationCode": "<user-verificationCode>",
    "verified": "<user-status>",
    "date": "<date>"
  }
}
```

### Upload Image

- API Endpoint: `http://127.0.0.1:5000/api/upload`
- Run the API with POST method and pass the following data in the **form-data**.

**Request**

```json
{
  "image": "image.jpg"
}
```

<br />

**Response**

```json
{
  "type": "success",
  "message": "Image uploaded successfully",
  "data": {
    "ETag": "<some-value>",
    "Location": "<link>",
    "key": "<name>",
    "Key": "<name>",
    "Bucket": "<bucket-name>"
  }
}
```

### Fetch all the image uploaded by the user

- API Endpoint: `http://127.0.0.1:5000/api/images`
- Run the API with POST method and pass the following data in the **header**.

**Request**

```json
{
  "auth-token": "token"
}
```

<br />

**Response**

```json
{
  "type": "success",
  "message": "Images fetched successfully",
  "data": [
    {
      "_id": "<image-id>",
      "name": "<image-name>",
      "link": "<image-url>",
      "user_id": "<user-id>",
      "date": "<date>"
    },
    {
      "_id": "<image-id>",
      "name": "<image-name>",
      "link": "<image-url>",
      "user_id": "<user-id>",
      "date": "<date>"
    }
  ]
}
```

### Fetch the image by image ID

- API Endpoint: `http://127.0.0.1:5000/api/image/:id`
- Run the API with POST method and pass the following data in the **header**.

**Request**

```json
{
  "auth-token": "token"
}
```

<br />

**Response**

```json
{
  "type": "success",
  "message": "Images fetched successfully",
  "data": [
    {
      "_id": "<image-id>",
      "name": "<image-name>",
      "link": "<image-url>",
      "user_id": "<user-id>",
      "date": "<date>"
    }
  ]
}
```
