# Graduate Application

The application i created is application that will be the my thesis for University.
<br />
If you want to start the application, <b>you will need to install</b> MySql Workbench and XAMPP Control Panel for starting the MySql server.
<br />
Both of users will need to register and login before entering the application, you cant visit Home page if you are not logged in.
<br />
Uppon logging in, user will get its jwt token which will expire in some period of time.
<br />
An app has 2 type of users, admin and ordinary, where the functionalities are:
<br />
<br />
Admin: 
- Add sneakers
- Remove sneakers
- Answer on ordinary users questions
- See how many pairs of sneakers are both and income from it
<br />
<br />

User:
- Can search for sneakers
- Can ask questions on Q&A page
- Can filter out sneakers based on brand and price
- Can see more details about the specified sneakers
- Can logout from account
<br />
## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
