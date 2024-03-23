const { Server } = require("socket.io");
const express = require("express");
const { PrismaClient } =require('@prisma/client') 
const prisma = new PrismaClient()
const app=express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
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
    const password=body.password
    const username=body.username
    console.log(body)
    if(!username || !password||!email){
        res.status(400).send('wrong cú pháp')
        return 
    }
    await prisma.users.create({
        data :{
            email:email,
            password:password,
            username:username,
        }
      })
    res.status(200).send('oke')
})





server.listen(5500, () => {
    console.log("app running1")
});
