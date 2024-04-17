const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const multer = require("multer");
const NodeRSA = require('node-rsa');
const fs = require('fs');
const { Server } = require("socket.io");
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
var server = require("http").Server(app);
const io = new Server(server, {});
io.on("connection", (client) => {
  console.log("New client connected");
  let room; 
  client.on("join", (receivedRoom) => {
    room = receivedRoom;
    client.join(room);
  });
  client.on("message", (data) => {
    io.to(room).emit("thread", data); 
  });
});
io.on("connection", (socket) => {
  console.log("people are connection");
  socket.on("hello", (data) => {
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
app.post("/api/register", async (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  const username = body.username;
  // console.log(body);
  if (!username || !password || !email) {
    res.status(400).send("Wrong syntax");
    return;
  }
  await prisma.users.create({
    data: {
      email: email,
      password: password,
      username: username,
    },
  });
  res.status(200).send("OK");
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.status(400).send("Wrong syntax");
    return;
  }
  const record = await prisma.users.findUnique({
    where: {
      email,
    },
    select: {
      password: true,
    },
  });
  if (!record) {
    res.status(404).send("User not found");
    return;
  }
  if (record.password !== password) {
    res.status(404).send("Wrong password");
    return;
  }
  const tokenString = `${email};${password}`;
  const encrypted = publicKey.encrypt(tokenString, "base64");
  res.status(200).send(encrypted);
});

app.post("/uploadphoto", upload.single("picture"), async (req, res) => {
  const token = req.query.token;
  console.log(token)
  if (!token) {
    return res.status(401).send('Token missing');
  }

  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString("base64");
    const finalImg = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_image, "base64"),
    };
    const parts = decrypted.split(';');
    const email = parts[0];
    const password = parts[1];
    console.log(password)
    const user = await prisma.users.findUnique({
      where: { email: email },
      select: { email: true, username: true, password: true }
    });
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    if (user.password !== password) {
      return res.status(401).send('Unauthorized');
    }

    const existingImage = await prisma.images.findUnique({
      where: { username: user.username }
    });

    if (existingImage) {
      await prisma.images.update({
        where: { username: user.username },
        data: { image: finalImg.image.toString('base64') }
      });
    } else {
      await prisma.images.create({
        data: {
          image: finalImg.image.toString('base64'),
          username: user.username
        }
      });
    }
    console.log(finalImg);
    return res.status(200).send("Upload successful");
  } catch (error) {
    console.error('Error during decryption:', error);
    return res.status(500).send('Error during decryption: ' + error.message);
  }
});
app.post("/uploadAvartar", upload.single("picture"), async (req, res) => {
  const token = req.query.token;
  console.log(token)
  if (!token) {
    return res.status(401).send('Token missing');
  }
  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString("base64");
    const finalImg = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_image, "base64"),
    };
    const parts = decrypted.split(';');
    const email = parts[0];
    const password = parts[1];
    const user = await prisma.users.findUnique({
      where: { email: email },
      select: { email: true, username: true, password: true }
    });
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    if (user.password !== password) {
      return res.status(401).send('Unauthorized');
    }

    const existingImage = await prisma.imageAvartars.findUnique({
      where: { username: user.username }
    });

    if (existingImage) {
      await prisma.imageAvartars.update({
        where: { username: user.username },
        data: { image: finalImg.image.toString('base64') }
      });
    } else {
      await prisma.imageAvartars.create({
        data: {
          image: finalImg.image.toString('base64'),
          username: user.username
        }
      });
    }
    console.log(finalImg);
    return res.status(200).send("Upload successful");
  } catch (error) {
    console.error('Error during decryption:', error);
    return res.status(500).send('Error during decryption: ' + error.message);
  }
});
//api getImg
app.get("/api/getImg", async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(401).send('Token is missing');
    return;
  }
  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const parts = decrypted.split(';');
    const email = parts[0];
    const user = await prisma.users.findUnique({
      where: {
        email:email
      },
      select: {
        username: true
      }
    });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    const img = await prisma.images.findUnique({
      where: {
        username: user.username
      },
      select: {
        image: true
      }
    });
    if (!img) {
      res.status(404).send('Image not found');
      return;
    }
    res.status(200).json(img.image);
  } catch (error) {
    console.error('Error during decryption:', error);
    res.status(500).send('Error during decryption: ' + error.message);
  }
});
app.get("/api/getAvartar", async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(401).send('Token is missing');
    return;
  }
  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const parts = decrypted.split(';');
    const email = parts[0];
    const user = await prisma.users.findUnique({
      where: {
        email:email
      },
      select: {
        username: true
      }
    });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    const img = await prisma.imageAvartars.findUnique({
      where: {
        username: user.username
      },
      select: {
        image: true
      }
    });
    if (!img) {
      res.status(404).send('Image not found');
      return;
    }
    res.status(200).json(img.image);
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
    const user=await prisma.images.findUnique({
      where:{
        username:name
      },
      select:{
        image:true,
        username:true,
      },
    })
    const userAvartar=await prisma.imageAvartars.findUnique({
      where:{
        username:name
      },
      select:{
        image:true
      },
    })
    if (!user) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
      return;
    }
    res.status(200).json({ username: user.username, image: user.image,userAvartar:userAvartar.image });
    } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm người dùng" });
  }
});
app.post("/create_feeds", async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(401).send('token missing');
    return;
  }
  
  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const parts = decrypted.split(';');
    const email = parts[0];
    const password = parts[1];
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
      select: {
        username: true,
      },
    });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    const record=await prisma.images.findUnique({
      where:{
        username:user.username
      },
      select:{
        image:true
      }
    })
    const content = req.body.content;
    await prisma.feeds.create({ 
      data: {
          username: user.username, 
          content: content,
          image:record.image
      }
    });

    res.status(200).json({ username: user.username ,content:content,image:record.image});
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing your request');
  }
});
app.get("/feeds", async (req, res) => {
  try {
      const feeds = await prisma.feeds.findMany();
      res.status(200).json(feeds);
  } catch (error) {
      console.error('Error fetching feeds:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
app.post("/create_feedPictures", upload.single("picture"), async (req, res) => {
  const token = req.query.token;
  console.log(token);
  if (!token) {
    return res.status(401).send('Token missing');
  }

  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString("base64");
    const finalImg = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_image, "base64"),
    };
    const parts = decrypted.split(';');
    const email = parts[0];
    const password = parts[1];
    console.log(password);
    const user = await prisma.users.findUnique({
      where: { email: email },
      select: { email: true, username: true, password: true }
    });

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    if (user.password !== password) {
      return res.status(401).send('Unauthorized');
    }
    const record1=await prisma.images.findUnique({
      where:{
        username:user.username
      },
      select:{
        image:true
      }
    })
    await prisma.feedPictures.create({
      data: {
        image: record1.image,
        picture: finalImg.image.toString('base64'),
        username: user.username
      }
    });
    console.log(finalImg);
    return res.status(200).send("Upload successful");
  } catch (error) {
    console.error('Error during decryption:', error);
    return res.status(500).send('Error during decryption: ' + error.message);
  }
});
app.get("/feedPictures", async (req, res) => {
  try {
      const feeds = await prisma.feedPictures.findMany();
      res.status(200).json(feeds);
  } catch (error) {
      console.error('Error fetching feeds:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
//change password
app.put ('/api/change-password', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(401).send('token missing');
    return;
  }
  try {
    const decrypted = privateKey.decrypt(token, 'utf8');
    const parts=decrypted.split(";")
    const email=parts[0]
    const body = req.body;
    const newPassword = body.newPassword;
    const user = await prisma.users.findUnique({
      where: {
        email:email,
      },
      select: {
        username: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.users.update({
      where: {
        username: user.username,
      },
      data: {
        password: newPassword,
      },
    });

    return res.status(200).json({ message: 'Password successfully changed' });
  } catch (error) {
    console.error('Error occurred while changing password:', error);
    return res.status(500).json({ error: 'An error occurred while changing password' });
  }
});

server.listen(5500, () => {
  console.log("app running1");
})