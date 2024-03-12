# Blog-app-backend

This is a backend app, that signs up users with hashed passwords using bcrypt, logs in users generating jwt tokens. One user can have multiple blogs, but one blog can only belong to one user. Every user can add blogs which can have some fields to it. Jwt token is verified while adding, updating or deleting any blog by the user. I have used transactions for when a blog is being added for adding a reference of the blog to the user, and while deleting the blog to remove the reference from the user.
