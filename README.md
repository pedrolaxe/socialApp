
# SocialApp

SocialApp is a MERN social networking

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://mit-license.org/)

## Features

* SignUp / SignIn.
* Forgot password.
* edit / delete your profile.
* Follow / Unfollow users.
* create / edit / delete posts.
* create / delete comments.
* Like / Unlike posts.
* Personal chat with users.
* Find People page

  
## To run the project locally
* clone this Repository by `git clone https://github.com/pedrolaxe/socialApp.git`.
* Inside /server directory create a .env file and add these
-  `MONGO_URI=mongodb://localhost:27017/socialapp`
-  `PORT=8080`

* Generate Token
-  `openssl rand 64 | base64 # (linux/macOS users) `
 or
`node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"`
- Add it to you env variable
-  `JWT_SECRET=token_generated_above`
-  `CLIENT_URL=http://localhost:3000`

* Inside /client directory create a .env file and add
-  `REACT_APP_API_URL=http://localhost:8080`

* Change the directory to /server in the terminal and run:
-  `yarn install`
-  `yarn start`

* Change the directory to /client in the terminal and run:
-  `yarn install`
-  `yarn start`

* Open your browser and enter url `http://localhost:3000`
To begin the development, run `npm start` or `yarn start`.
To create a production bundle, use `npm run build` or `yarn build`.

## Tech Stack of this Project

* Frontend: Reactjs, Bootstrap 4
* Database: MongoDB

## TO-DO

- [ ] Display status of users online/offline in chat.
- [ ] Add Notifications when someone follows/messages you or likes/comments on your post.
- [ ] Create seach page and add seach on menu bar
