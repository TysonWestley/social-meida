const { Server } = require("socket.io");
const express = require("express");
const { PrismaClient } =require('@prisma/client') 
const prisma = new PrismaClient()
const bodyparser = require('body-parser')

const app=express();

var server = require("http").Server(app);

const io = new Server(server, {});

io.on("connection", (socket) => {
    console.log("people are connection")
    socket.on("hello",(data)=>{
        console.log({data})
        io.emit('messenger',data)
    })
  });


app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.get("/",(req,rep)=>{
    rep.sendFile(__dirname + "/code/socialmedia.html")
})
app.get("/validator",(req,rep)=>{
    rep.sendFile(__dirname + "/code/validator.html")
})
app.get("/demo",(req,rep)=>{
    rep.sendFile(__dirname + "/code/demo.html")
})
app.post("/api/resister",async (req,res)=>{
    const body=req.body
    const email=body.email
    const username=body.username
    const password=body.password
    if(!username || !password||!email){
        res.status(400).send('wrong cú pháp')
        return 
    }
    await prisma.users.create({
        data :{
            email:email,
            username:username,
            password:password,
        }
      })
    res.status(200).send('oke')
})





server.listen(5500, () => {
    console.log("app running1")
});
