const { Server } = require("socket.io");
const express = require("express");
//tương tác cơ sở dữ liệu với prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const multer = require("multer");
const NodeRSA = require('node-rsa');
const fs = require('fs');

// Load the keys from files
const privateKeyPem = fs.readFileSync('private.pem', 'utf8');
const publicKeyPem = fs.readFileSync('public.pem', 'utf8');

const privateKey = new NodeRSA(privateKeyPem, 'pkcs1-private');
const publicKey = new NodeRSA(publicKeyPem, 'pkcs8-public');
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
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
  const encrypted =  publicKey.encrypt(tokenString, "base64");
  res.status(200).send(encrypted);
});

app.post("/uploadphoto", upload.single("picture"), async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(401).send('Token missing');
    return;
  }

  try {
    const decrypted = privateKey.decrypt(token, 'utf8');

    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString("base64");
    const finalImg = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_image, "base64"),
    };
    let parts = decrypted.split(';');
    const email = parts[0]
    const password = parts[1]

    const record = await prisma.users.findUnique({
      where: {
        email: email
      },
      select: {
        email: true,
        username: true,
        password: true
      }
    });

    if (!record) {
      res.status(401).send('Unauthorized');
      return;
    }

    if (record.password == password) {
      console.log(prisma.images)
      await prisma.images.create({
        data: {
          username: username,
          image: finalImg
        }
      });
      console.log(finalImg);
    } else {
    }

    res.status(200).send("Upload successful");
  } catch (error) {
    console.error('Error during decryption:', error);
    res.status(500).send('Error during decryption: ' + error.message);
  }
});

//api getname
// Thêm endpoint API để lấy tên người dùng từ token
app.get("/api/getname", async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(401).send('Token không hợp lệ');
    return;
  } 
  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const parts = decrypted.split(';');
    const email = parts[0];
    const password = parts[1];
    const user = await prisma.users.findUnique({
      where: {
        email: email
      },
      select: {
        username: true 
      }
    });
    if (!user) {
      res.status(404).send('Không tìm thấy người dùng');
      return;
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    res.status(500).send('Lỗi khi giải mã token');
  }
});
app.get("/api/searchUser", async (req, res) => {
  const { name } = req.query;

  try {
    const user = await prisma.users.findUnique({
      where: {
        username: name
      }
    });

    if (!user) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm người dùng" });
  }
});
//feed post
app.post("/api/post", async (req, res) => {
  const { content, username } = req.body;

  try {
    // Lưu thông tin bài viết vào cơ sở dữ liệu
    const newPost = await prisma.posts.create({
      data: {
        content: content,
        username: username, 
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Lỗi khi đăng bài viết:", error);
    res.status(500).json({ message: "Lỗi khi đăng bài viết" });
  }
});



server.listen(5500, () => {
  console.log("app running1");
});