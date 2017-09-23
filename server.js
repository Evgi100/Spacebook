var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', { useMongoClient: true }, function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));






// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) return console.log("Eror getting post from the DB");
    res.send(posts)
  });
});
// 2) to handle adding a post
app.post('/posts', function (req, res) {
  console.log(req.body)
  var post1 = new Post(req.body);
  console.log(post1);
  post1.save();

});
// 3) to handle deleting a post
app.delete('/posts/:id', function (req, res) {
  var postId = req.params.id;
  Post.findByIdAndRemove({ postId }), function (err) {
    if (err) {
      return console.log("Eror getting post to delete from the DB");
    } else {
      res.redirect()
    }
  }
});
// 4) to handle adding a comment to a post
// app.post('/posts/:id', function (req, res) {
//   if (err) return console.log("Eror getting post to delete from the DB");
//   var postId = req.params.post._id;
//   post = Post.findOne({ postId })
//   post.comments.push(req.body);
//   res.send('Added comment')
//   console.log(post1);
// });
// 5) to handle deleting a comment from a post




app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});
