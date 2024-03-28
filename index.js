const { Server } = require("socket.io");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 512 });

// const text = 'Hello RSA!';
// const encrypted = key.encrypt(text, 'base64');
// console.log('encrypted: ', encrypted);
// const decrypted = key.decrypt(encrypted, 'utf8');
// console.log('decrypted: ', decrypted);
var server = require("http").Server(app);
const io = new Server(server, {});

io.on("connection", (socket) => {
  console.log("people are connection");
  socket.on("hello", (data) => {
    console.log({ data });
    io.emit("messenger", data);
  });
});

app.use(express.static("public"));
app.get("/", (req, rep) => {
  rep.sendFile(__dirname + "/code/socialmedia.html");
});
app.get("/validator", (req, rep) => {
  rep.sendFile(__dirname + "/code/validator.html");
});
app.get("/messenger", function (req, res) {
  res.sendFile(__dirname + "/socialmedia.html");
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });
app.post("/api/resister", async (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  const username = body.username;
  console.log(body);
  if (!username || !password || !email) {
    res.status(400).send("wrong cú pháp");
    return;
  }
  await prisma.users.create({
    data: {
      email: email,
      password: password,
      username: username,
    },
  });
  res.status(200).send("oke");
});
app.post("/api/login", async (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  console.log(body);
  if (!password || !email) {
    res.status(400).send("wrong cú pháp");
    return;
  }
  const record = await prisma.users.findUnique({
    where: {
      email: email,
      password: password,
    },
  });
  if (!record) {
    res.status(404).send("not found");
    return;
  }
  const tokenString = `${email};${password}`;
  const encrypted = key.encrypt(tokenString, "base64");
  res.status(200).send(encrypted);
});

app.post("/uploadphoto", upload.single("picture"), (req, res) => {
  const img = fs.readFileSync(req.file.path);
  const encode_image = img.toString("base64");
  const finalImg = {
    contentType: req.file.mimetype,
    image: Buffer.from(encode_image, "base64"),
  };

  console.log(finalImg)

});

app.get("/photos", (req, res) => {
  db.collection("mycollection")
    .find()
    .toArray((err, result) => {
      const imgArray = result.map((element) => element._id);
      console.log(imgArray);

      if (err) return console.log(err);
      res.send(imgArray);
    });
});
app.get("/photo/:id", (req, res) => {
  var filename = req.params.id;

  db.collection("mycollection").findOne(
    { _id: ObjectId(filename) },
    (err, result) => {
      if (err) return console.log(err);

      res.contentType("image/jpeg");
      res.send(result.image.buffer);
    }
  );
});

app.listen(5500, () => {
  console.log("app running1");
});
