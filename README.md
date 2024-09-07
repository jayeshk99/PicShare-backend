## Description

PicShare is a web app where users can share their photos, explore pictures from others, and save their favorites. It’s a simple and engaging platform for discovering and showcasing images.

## Project setup
Node version: v20.17.0 <br>
npm version: 10.8.2
```bash
$ npm install
```

## Database setup

Create a database and provide the connection details in environment file.
Synchronization is set to true (for devlopment) so as soon as service starts it will create the tables in database.

## Environment file

Add the following varibles in .env file in root folder of project with the credentials of database created earlier.

```bash
DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
DB_USER=YOUR_DB_USER
DB_USER_PWD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation


### POST - User login <br>
This API is used for user login. If the user does not exist, a new user will be created and logged in.
```
$ POST /user/login
```
Headers
```
Content-Type    application/json
```
Body
```
{
  "userName": ""
}
```
Response  
Success (HTTP 200 OK)<br>
Returns the userId and userName of the logged-in user.<br>
```
{
  "statusCode": 200,
  "data": {
    "userId": "",
    "userName": ""
  }
}
```
Error (HTTP 404 )<br>
If the user does not exist and an error occurs during user creation.
```
{
  "statusCode": 404,
  "message": "User not found or could not be created"
}
```
### GET - All Posts <br>
This API is used for getting the Images list shared by all users.
```
$ GET /post/all
```
Headers
```
Content-Type    application/json
```
Query params
```
page (optional): The page number for pagination (default: 1).
limit (optional): Number of posts per page (default: 12).
```
Response  
Success (HTTP 200 OK)<br>
Returns the images list..<br>
```
{
  "statusCode": 200,
  "data": [
    {
      "id": "",
      "imageUrl": "",
      "title": "",
      "user": {
        "id": "",
        "userName": ""
      },
      "favourites": [
        { "id": "",
          "userId": ""
         }
      ]
    }
  ],
  "totalCount": 100,
  "page": 1,
  "totalPages": 10
}
```
Error (HTTP 500 Internal Server Error)<br>
If the user does not exist and an error occurs during user creation.
```
{
  "statusCode": 500,
  "message": "Error in getting all posts: error message",
  "error": "Internal Server Error"
}
```
### POST - Share Image <br>
This API is used for sharing a image.
```
$ POST /post/share
```
Headers
```
Content-Type    application/json
Authorization   Bearer xxx   (Bearer token which will be userId returned from login API.)
```
Body
```
{
  "imageUrl": "https://example.com/image.jpg",
  "title": "A beautiful scenery"
}
```
Response  
Success (HTTP 201 Created)<br>
Returns the post details shared succesfully.<br>
```
{
  "statusCode": 201,
  "data": {
    "id": "postId",
    "imageUrl": "https://example.com/image.jpg",
    "createdBy": "userId",
    "title": "A beautiful scenery",
    "createdAt": "2024-09-07T12:00:00.000Z"
  }
}
```
Error (HTTP 500 Internal Server Error)<br>
If the user does not exist and an error occurs during user creation.
```
{
  "statusCode": 500,
  "message": "Error in creating post",
  "error": "Internal Server Error"
}
```
### GET Favourite Posts <br>
This API is used for getting the favourite Images of the user logged in.
```
$ GET /post/favourites
```
Headers
```
Content-Type    application/json
Authorization   Bearer xxx   (Bearer token which will be userId returned from login API.)
```
Response  
Success (HTTP 200 OK)<br>
Returns the images list..<br>
```
{
  "statusCode": 200,
  "data": [
    {
      "id": "string",
      "post": {
        "id": "string",
        "title": "string",
        "content": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "user": {
        "id": "string",
        "username": "string",
        "email": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```
Error (HTTP 500 Internal Server Error)<br>
Error occurred while retrieving the favourite posts.
```
{
  "statusCode": 500,
  "message": "Error in getting favourite posts for {userId} : {error}"
}
```
### POST - Add to favourite <br>
This API is used for adding a image to favourites.
```
$ POST /post/favourites/add
```
Headers
```
Content-Type    application/json
Authorization   Bearer xxx   (Bearer token which will be userId returned from login API.)
```
Body
```
{
  "postId": "string"
}
```
Response  
Success (HTTP 201 Created)<br>
Returns the post details shared succesfully.<br>
```
{
  "statusCode": 201,
  "data": "Favourite added successfully"
}
```
Error (HTTP 404)<br>
The specified post ID does not exist.
```
{
  "statusCode": 404,
  "message": "PostID {postId} does not exist"
}
```
Error (HTTP 500 Internal Server Error)<br>
Error occurred while adding the post to favourites.
```
{
  "statusCode": 500,
  "message": "Error in adding favourite posts for {userId} : {error}"
}
```
### DELETE - Remove from favourites <br>
Deletes a post from the user's list of favourites.
```
$ DELETE /post/favourites/:favouriteId
```
Headers
```
Content-Type    application/json
Authorization   Bearer xxx   (Bearer token which will be userId returned from login API.)
```
Path parameters
```
favouriteId: (string) The ID of the favourite post to be deleted.
```
Response  
Success (HTTP 201 Created)<br>
Returns the deletion success messege.<br>
```
{
  "statusCode": 200,
  "message": "Favourite pic deleted successfully"
}
```
Error (HTTP 404)<br>
The specified favourite post ID does not exist.
```
{
  "statusCode": 404,
  "message": "Favourite post Id does not exist"
}
```
Error (HTTP 500 Internal Server Error)<br>
Error occurred while deleting the post to favourites.
```
{
  "statusCode": 500,
  "message": "Error in deleting favourite post {favouritePostId} : {error}"
}
```
