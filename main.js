const express = require("express");
const app = express();
const fs = require("fs");

const bodyParser = require("body-parser");
const bodyParserForm =bodyParser.urlencoded();
const {application} =require("express");
let settings={
    counter : 1
}
let books =[]

app.set("view engine", "ejs");

//Display all books
app.get("/books", function(req, res){
    let fbooks = books;
    if(req.query.q){
        fbooks=books.filter(book=>book.Title.indexOf(req.query.q)>-1 || book.Author.indexOf(req.query.q)>-1);
    }
    res.render("books.ejs",{q:req.query.q , fbooks});
})
app.get("/home", function(req, res){
    let fbooks = books;
    if(req.query.q){
        fbooks=books.filter(book=>book.Title.indexOf(req.query.q)>-1 || book.Author.indexOf(req.query.q)>-1);
    }
    res.render("books.ejs",{q:req.query.q , fbooks});
})
//Add new book
app.get("/addbook", function(req, res){
    res.render("addbook.ejs");
})
app.post("/addbook" , bodyParserForm ,function(req , res){
    req.body.Id = settings.counter++;
    books.push(req.body);
    saveToFile();
    res.render("redirect.ejs")
})
//edit book
app.get("/updatebook" , function(req,res){
    let book =books.find(book=>book.Id == req.query.Id);
    res.render("updatebook.ejs",{book});
});
app.post("/updatebook",bodyParserForm,function(req,res){
    let book =books.find(book=>book.Id ==req.body.Id);
    book.Title =req.body.Title;
    book.Author=req.body.Author;
    saveToFile();
    res.render("redirect.ejs");
})

//Delete book
app.get("/deletebook",function(req,res){
    let bookIndex = books.findIndex(book=>book.Id == req.query.Id);
    books.splice(bookIndex,1);
    saveToFile();
    res.render("redirect.ejs");
})
//saving
function saveToFile(){
    fs.writeFile("books.db",JSON.stringify(books),function(err){
        if(err) 
            console.log(err);
    })
    fs.writeFile("settings.db",JSON.stringify(settings),function(err){
        if(err)
            console.log(err);
    })
}
function loadData(){
    fs.readFile("books.db",function(err, data){
        if(err){
            console.log(err);
        }
        else{
            books =JSON.parse(data);
        }
    })
    fs.readFile("settings.db",function(err,data){
        if(err){
            console.log(err);
        }else{
            settings = JSON.parse(data)
        }
    })
}
loadData();

app.listen(80);