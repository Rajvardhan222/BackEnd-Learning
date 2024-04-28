

# YouTube Backend

This is the backend for a YouTube-like application, providing APIs for user management, video uploading, subscriptions, playlists, comments, tweets, and likes.

## Getting Started

To get started with this project, follow these steps:

1. Clone this repository to your local machine.

2. Install dependencies using npm:

   ```
   npm install
   ```



---

#   Environment Variables

To set up environment variables for your project, follow these steps:

1. **Create `.env` File**:
   - Create a `.env` file in the root directory of your project.

2. **Add Environment Variables**:
   - Open the `.env` file and add the following environment variables:

   ```plaintext
   PORT=8000
   CORS_ORIGIN=*
   MONGODB_URL= 
   ACCESS_TOKEN_SECRET=qbMd9AA6eFd6TVFdYSzD661LpwOg1lUyjisdUcEQwvSh2zRI13tbQTmuySDQ5HdKtmVe71GAAlo24PJCFsfwFm547wgQabdaBFQJA55OR
   ACCESS_TOKEN_EXPIRY=10d
   REFRESH_TOKEN_SECRET=2yhzUg1CWsLdPUr6LwWpLdRDIeAi2vfr9ZDFrSclCWFMji5IQhaz1QlXlPS6caPmbywfwZIBesT5QZMtE8r8tor4RqqqoEQgU0CgRIVfrexA9gfaJp1gMc
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

3. **Explanation**:
   - `PORT`: Specifies the port on which your server will run.
   - `CORS_ORIGIN`: Sets the allowed origin for CORS requests.
   - `MONGODB_URL`: Specifies the MongoDB URI for connecting to your database.
   - `ACCESS_TOKEN_SECRET`: Secret key for signing JWT access tokens.
   - `ACCESS_TOKEN_EXPIRY`: Expiry duration for JWT access tokens.
   - `REFRESH_TOKEN_SECRET`: Secret key for signing JWT refresh tokens.
   - `REFRESH_TOKEN_EXPIRY`: Expiry duration for JWT refresh tokens.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials for accessing the Cloudinary service.

4. **Save Changes**:
   - Save the `.env` file after adding the environment variables.

These environment variables will be used by your application to configure settings such as server port, database connection, JWT authentication, and Cloudinary integration.

---

Feel free to customize the explanations and details according to your project's specific requirements.
4. Start the server:

   ```
   npm run dev
   ```

5. The server will be running on `http://localhost:8000`.

## Available Endpoints

### Users
- `/api/v1/users`: User management endpoints for registration, login, profile update, etc.

### Video Upload
- `/api/v1/video`: Endpoints for uploading videos.

### Subscriptions
- `/api/v1/subscription`: Endpoints for managing user subscriptions.

### Playlists
- `/api/v1/playlist`: Endpoints for managing user playlists.

### Comments
- `/api/v1/comments`: Endpoints for managing video comments.

### Tweets
- `/api/v1/tweets`: Endpoints for managing tweets.

### Likes
- `/api/v1/like`: Endpoints for managing likes on videos.

## Dependencies

- [bcrypt](https://www.npmjs.com/package/bcrypt): Password hashing library.
- [cloudinary](https://www.npmjs.com/package/cloudinary): Cloud storage for video uploads.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Parse cookies in request headers.
- [cors](https://www.npmjs.com/package/cors): Enable Cross-Origin Resource Sharing (CORS).
- [dotenv](https://www.npmjs.com/package/dotenv): Load environment variables from .env file.
- [express](https://www.npmjs.com/package/express): Web framework for Node.js.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Generate and verify JWT tokens for user authentication.
- [mongoose](https://www.npmjs.com/package/mongoose): MongoDB object modeling tool.
- [mongoose-aggregate-paginate-v2](https://www.npmjs.com/package/mongoose-aggregate-paginate-v2): Pagination support for MongoDB aggregate queries.
- [multer](https://www.npmjs.com/package/multer): Handle multipart/form-data for file uploads.
- [nodemon](https://www.npmjs.com/package/nodemon): Monitor changes in the source code and automatically restart the server.


---


