const ipRoom = document.querySelector('#room');
const btnJoin = document.querySelector('#btn-join');
const chatMess = document.querySelector('#chat-mess');
const sendChat = document.querySelector('#send-chat');
const messengerUl = document.querySelector('#messenger');
const username = document.querySelector('#usernameDisplay');
const span=document.querySelector('.userMessenger .error')
const sucess=document.querySelector('.userMessenger .success')
let check;
const socket = io();
console.log('hello')
socket.on('connect', (data) => {
    console.log(data);
});
btnJoin.addEventListener('click', (e) => {
    e.preventDefault();
    if(ipRoom.value){
        const room = ipRoom.value;
        socket.emit('join', room);
        check=true
        span.innerHTML=""
        sucess.innerHTML='Successfully Join Room'
    }
    else{
        check=false
        span.innerHTML='Can not be empty'
    }
});

sendChat.addEventListener('click', (e) => {
    e.preventDefault();
    if(check){
        const message = chatMess.value;
        socket.emit('message',username.textContent +':' +message);
        span.innerHTML=''
    }
    else{
        span.innerHTML='Please join room first'
    }
});

socket.on('thread', (data) => {
    const li = document.createElement('li');
    li.innerHTML = data;
    messengerUl.appendChild(li);
    console.log(messengerUl)
});
