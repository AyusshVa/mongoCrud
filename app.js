const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const url = require('url');

app.use(bodyParser.urlencoded({
    extended: true
}))
app.set("view engine", "ejs");

// establishing connection in mongoose and mongodb

const mongoose = require("mongoose");
const { env } = require("process");
mongoose.connect("mongodb+srv://admin-ayussh:test123@cluster0.t3mdo.mongodb.net/techDB");

// mongoose schema
const techSchema = new mongoose.Schema({
    imageUrl: String,
    title: String,
    Content: String,
    heading: String
});

// crating mongoose model
const techModel = new mongoose.model("tech", techSchema);




// ***************************************************88crud operations

// default landing page form
app.get("/", (req, res) => {
    res.render("index")
})

// ADD operation: add data to the database // assuming that the data to insert will be given by filling a form. 
app.post("/", (req, res) => {
    let imgUrl = req.body.imgUrl;
    let title = req.body.title;
    let content = req.body.content;
    let heading = req.body.heading;

    // creating a javascript object to insert to the mongo collection: 
    let obj = {
        imageUrl: imgUrl,
        title: title,
        Content: content,
        heading: heading
    };

    // code to insert the document into the collection: 
    techModel.create(obj, (err) => {
        if (err) console.log(err);
        res.send("added")
        res.end();
    })
})

// READ  (I don't find the difference between edit and update so I am adding a read functionaliy(update is later))
app.get("/read", (req, res) => {

    // this will show the data in form of a table.
    techModel.find({}, (err, data) => {
        res.render("read", {
            records: data
        });
    })
})

// update & delete ( I added a button on the row of the document, where person can delete the row)

app.post("/:page/:mongoId", (req, res) => {
    const page = req.params.page;
    const id = req.params.mongoId;
    if (page === 'update') {
        // code for update/edit

        res.redirect(url.format({
            pathname: "/update",
            query: {
                "q": id
            }

        }));

    } else if (page === 'delete') {
        // code for deleting: 
        techModel.deleteOne({
            _id: id
        }, (err) => {
            if (err) console.log(err)
            res.redirect("/read");
            res.end()
        })
    }

})


// to update (first you select the button given to the right of every row in the table data, from where it will get the id of doc you want to update, then this function will render a form whose data will be updated)
app.get("/update", (req, res) => {
    let id = req.query.q;
    res.render("update", {
        uniqueId: id
    });
})


app.post("/update", (req, res) => {
    let id = req.body.uniqueId;
    console.log(id)
    let imgUrl = req.body.imgUrl;
    let title = req.body.title;
    let content = req.body.content;
    let heading = req.body.heading;
    let obj = {
        imageUrl: imgUrl,
        title: title,
        Content: content,
        heading: heading
    };

    techModel.updateOne({
        _id: id
    }, obj, (err) => {
        if (err) console.log(err)
        res.redirect("/read")
    });
})


app.listen("3000" || process.env.PORT  , () => {
    console.log("server is running and up!")
})