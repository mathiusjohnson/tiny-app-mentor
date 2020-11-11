const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

const { checkForUserByEmail, checkForEmailInDatabase, generateRandomString, urlsForUserID, timeStamp } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
  console.log("req: ", req);
  const templateVars = { 
    shortURL: req.params.shortURL, longURL: req.params.url };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(302, '/urls');
})
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  console.log("shorturl: ", req.params.shortURL);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
