const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Web development, also known as website development, refers to the tasks associated with creating, building, and maintaining websites and web applications that run online on a browser. It may, however, also include web design, web programming, and database management.Web development is closely related to the job of designing the features and functionality of apps (web design). The term development is usually reserved for the actual construction of these things (that is to say, the programming of sites).The basic tools involved in web development are programming languages called HTML (Hypertext Markup Language), CSS (Cascading Style Sheets), and JavaScript";
const aboutContent = "This website is used to create different blogs which can be composed and viewed by different users.";
const contactContent = "Mr.Gurram Himanth Reddy. (phone : +916281323978) (mail : kimhkimhk@gmail.com)";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB")

const postSchema = new mongoose.Schema({
  title: {type: String},
  content: {type: String}
      })

const Post = new mongoose.model("Post", postSchema)

app.get("/", function (req, res) {
  async function k() {
    let post1 = await Post.find({});
  return res.render("home", {
    startingContent: homeStartingContent,
    posts: post1
    });
  } k()
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()

  return res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  async function k() {
    let post1 = await Post.find({});

    post1.forEach(function (post) {
      const storedTitle = _.lowerCase(post._id);

      if (storedTitle === requestedTitle) {
        return res.render("post", {
          title: post.title,
          content: post.content
        });
        // return res.redirect("/posts/"+requestedTitle) this can also be used
      }
    });
  }k()
});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
