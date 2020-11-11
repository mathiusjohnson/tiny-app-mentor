const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const { checkForUserByEmail, checkForEmailInDatabase, generateRandomString, urlsForUserID, timeStamp } = require('./helpers');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  const user = users[req.cookies['user_id']];

  let templateVars = {
    urls: urlDatabase,
    user
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL, userID,};

  res.redirect(303, `/urls/${shortURL}`);
});

// /:shorturl
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies['user_id']];

  let templateVars = { 
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user  
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(302, '/urls');
})

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];

  let templateVars = {
    user,
    urls: urlDatabase
  };
  console.log(templateVars);

  res.render("urls_new", templateVars);
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
    const editFromUser = req.body.longURL;
    console.log("edit from user: ", editFromUser);
    urlDatabase[shortURL] = editFromUser;
    console.log(urlDatabase[shortURL]);
    res.redirect('/urls/');
})

app.get("/u/:shortURL", (req, res) => {
  console.log("shorturl: ", req.params.shortURL);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    user
  };
  res.render('login' ,templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const validUser = checkValidUser(email, password);
  console.log(email, password, validUser);
  if (validUser) {
    res.cookie('user_id', validUser.id);
    res.redirect('/urls');
  } else {
    res.status(403).send('<h1> Error 403. Forbidden. Invalid Credentials.');
  }
});

app.get("/logout", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    user
  };
  res.render('logout' ,templateVars);
});

app.post("/logout", (req, res) => {
  const userEmail = req.body.email;
  res.clearCookie('user_id');  
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    user
  };
  res.render('register' ,templateVars);
});



app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (password === null) {
    res.status(400).send('<h1>Status of 400: Bad Request. Cannot leave Email or Password blank');
  }

  const user = checkForUserByEmail(email);

  if (!user) {
    const userId = newUser(email, password);

    res.cookie('user_id', userId);
    console.log(users);
    res.redirect('/urls');
  } else {
    res.status(400).send('<h1>Status of 400: Bad Request. Email Already In Use</h1>');
  }
});