const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// ---- mongoose Connection Start----
mongoose.connect('mongodb://127.0.0.1:27017/wikiDb', {
    //  userNewUrlParser:true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected!!!!!');
}).catch((e) => {
    console.log(e);
});
//---- mongoose Connetion End ----

//---- Creating Schema ----
const articleSchema = {
    title: String,
    content: String
}
// ---- Ending Creating Schema ----

// Article Model --> mongoose automatically changs this to "articles"
const Article = mongoose.model("Article", articleSchema);


// Below Code has been refactored using app.route method
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// //Rest API Start
// // 1. GET Method Start
// app.get("/articles",(req,res)=>{
//     Article.find((err,foundArticles)=>{
//         if(!err){ console.log(foundArticles);
//             res.send(foundArticles);}
//             else{
//                 console.log(err);
//             }

//     });
// });
// // GET End
// //================================================

// // 2. Post Method Start
// app.post("/articles",(req,res)=>{
//     const title = req.body.title;
//   const content = req.body.content;
//   const newArticle = new Article({
//     title:title,
//     content:content
//   });
//   newArticle.save()
// .then(()=>{
//     res.send('Record Saved!!!!!')
//     console.log('Record Saved!!!!!');
// }).catch((e)=>{
//     res.send(e);
//     console.log(e);
// });
// });
// // 2. Post Method End
// //================================================

// // 3.Delete Method Start

// app.delete("/articles",(req,res)=>{
//     Article.deleteMany((err)=>{
//         if(!err){
//             res.send("Successfully deleted all articles.");
//         }else{
//             res.send(err);
//         }
//     });
// });
// // Delete Method End
// //Rest API End
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// app.route used for chainable routing i.e for a single route(/article ) defining diffrent methods(GET,POST,DELET etc)

//-------------------- Request targeting all the articles -------------------------
app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                console.log(foundArticles);
                res.send(foundArticles);
            }
            else {
                console.log(err);
            }

        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({
            title: title,
            content: content
        });
        newArticle.save()
            .then(() => {
                res.send('Record Saved!!!!!')
                console.log('Record Saved!!!!!');
            }).catch((e) => {
                res.send(e);
                console.log(e);
            });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

//--------------------------Reuest targeting a single article ----------------------

app.route("/articles/:articleTitle")
    .get((req,res)=>{
        const articleTitle = req.params.articleTitle;
        Article.findOne({title:articleTitle},(err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send(`No article found with title = ${articleTitle} !!!!!!!`);
            }
        })
    }).put((req,res)=>{
        Article.updateOne(
            {title:req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            (err)=>{
                if(!err){
                    res.send("Succesfully Updated Records !!!!!");
                }else{
                    res.send(err);
                }
            }
        )
    })
    .patch((req,res)=>{
        Article.updateOne(
            {title:req.params.articleTitle},
            { $set :req.body},
            (err)=>{
                if(!err){
                    res.send("Successfull update specified feilds !!!!!")
                }else{
                    console.log(err);
                }
            }
          
        );
    })
    .delete((req,res)=>{
        Article.deleteOne(
            {title:req.params.articleTitle},
            (err)=>{
                if(!err){
                    res.send(`Succesfully Deleted ${req.params.articleTitle}`);
                }else{
                    res.send(err);
                }
            }
        )
    });











app.listen(3000, function () {
    console.log("Server started on port 3000");
});