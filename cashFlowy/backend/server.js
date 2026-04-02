// const express =  require('express');    old way 

import express from "express";


const app = express();


app.get("/", (req, res) => {
   res.send("Its working");
});

app.listen(5001, () => {
    console.log("Server is running on PORT: 5001");
});



