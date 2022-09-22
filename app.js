const express = require('express');
const bodyparser = require('body-parser');

var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect('mongodb://localhost:27017/wikiDB');



const app = express();
var Schema = mongoose.Schema;

var wikis = new Schema({

    title: String,
    content: String
});
// Compile model from schema
var wiki = mongoose.model('articles', wikis);


app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));


const newArticle = new wiki({
    title: "Ram bihari bajpeyi",
    content: "nothing more to say about what happend to him but sure about one thing"
})

// newArticle.save(()=> console.log("saved"));


app.route("/articles")

    .get(function (req, res) {

        wiki.find(function (err, found) {
            // res.render("articles",{homeArray: found});
            res.send(found);
        })
    })
    .post(function (req, res) {

        let article = req.body.title;
        let posting = req.body.content;
        console.log(article);
        console.log(posting);

        const newWiki = new wiki({
            title: article,
            content: posting
        })

        newWiki.save(() => console.log("posting data saved"));
        res.send("We saved you data to database");

    })
    .delete(function (req, res) {

        wiki.deleteMany(function (err) {
            if (!err) {
                console.log("all items deleted");
                res.send("deleted");
            } else {
                console.log(err);
            }
        })

    });




app.route("/articles/:ask")
    .get(function (req, res) {

        let requested = req.params.ask;
        // wiki.findById(requested, function (err, found) { 
        //     res.send(found);
        //  })
        wiki.findOne({ title: requested }, function (err, found) {
            if (!err) {
                res.send(found);
            } else {
                res.send(err);
            }
        });
    })
    .put(function (req, res) {
        wiki.update({ title: req.params.ask },
            {
                title: req.body.title,
                content: req.body.content
            },
            
            function (err, result) {
                if (!err) {
                    res.send("we updated your requested data");
                } else {
                    res.send(err);
                }
            });
    })
    .patch(function (req, res) {  
        wiki.update(
            {title:req.params.ask},
            {$set:req.body},
            function (err, found) { 
                if(!err){
                    res.send("Patch successful");
                }else{
                    res.send(err);
                }
             }
        )
    })
    .delete(function (req, res) {  
        wiki.deleteOne(
            {title:req.params.ask},
            function (err) { 
                if(!err){
                    res.send("item Deleted successfully");
                }else{
                    res.send(err);
                }
             }
            
        )
    });








app.listen(3000, function () {
    console.log("Server started at port 3000");
});



