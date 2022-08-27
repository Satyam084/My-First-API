const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});


const Article = mongoose.model('article', articleSchema);

//perform operation on all the articles present in our Database
app.route("/articles")
.get(function(req, res) {

  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
.post(function(req,res){

  const newTitle = req.body.title;
  const newContent = req.body.content;
  // console.log(req.body.title);
  // console.log(req.body.content);
  const newArticle = new Article({
    title: newTitle,
    content: newContent
  });

  newArticle.save(function(err){
    if(!err){
      res.send("successfully added new Article");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("All the Articles deleted successfully");
    }else{
      res.send(err);
    }
  });
});

//to perform operations with specific articles
app.route("/articles/:articleTitle")
.get(function(req,res){
//  const requestedArticle = req.params.articleTitle;
  Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send(err);
    }
  });
})
.put(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
  //  {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated");
      }else{
        res.send(err);
      }
    }
  );
})
.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated Article");
      }
      else{
        res.send(err);
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err){
      res.send("An article deleted successfully");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000, function(req, res) {
  console.log("Server running successfully");
})
