const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Without immediate emission reductions, the total and irreversible loss of mountain glaciers around the world will be locked in. With the climate crisis already devastating communities across the Hindu Kush Himalaya, and 2 billion people in Asia reliant on waters held in these mountains alone, for food and water security, ICIMOD has launched #SaveOurSnow a global advocacy campaign to build the public and political will for faster action and greater ambition. We launched #SaveOurSnow on May 29, during celebrations to mark the 70th anniversary of the first ascent of Mount Everest.";
const aboutContent = "#SaveOurSnow brings together three key communities that are closest to Earth’s cryosphere, and most deeply impacted by the imminent and irreversible loss of its snow and ice – mountain communities, athletes, and scientists – to forge an unusual lobbying bloc too powerful to ignore.";
const contactContent = "Contact our website https://hkh.icimod.org/saveoursnow/ for further details.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/dataDB")

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
    // console.log(posts)
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

  // posts.push(post);
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
        return res.redirect("/posts/"+requestedTitle)
      }
    });
  }k()
});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
