const express = require("express");
const app = express();

//const port  = 4000;'
const port = process.env.PORT || 4000;

const http = require("http"); 
const path  =  require("path");
const server = http.createServer(app);
require('dotenv').config(); 


app.get('/',(req,res)=>{
    res.send(' <h1> Hey, Welcome to my world </h1>')
    })

//  const io  = require("socket.io")(http);
const socketIo  = require("socket.io")
const io = socketIo(server, {
    transports: ['websocket', 'polling'], // Prefer WebSocket transport
});

let allMessages=[];
const cors = require("cors");
//app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors());
// Example allowing only specific origins and methods
const corsOptions = {
    origin: 'https://shubham-yadav13.github.io/fullstack/',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  };
  
  app.use(cors(corsOptions));

var usersCount = 0;
io.on('connection', ( socket )=>{
    //code for connection with io
    console.log(socket.id,'SOCKET ID')
    usersCount++;
    console.log({message: usersCount,id:socket.id},"User Connected " );
  
    if(usersCount>0){
        socket.emit('newUser', {message:'Welcome to the new user',id:socket.id}, );
        //it will sent the data  to the new user only  As it is a custom event
      
    // for specific user custom connection using socket.emit
    // socket.emit( 'newUser', {message: 'Hi, Welcome Dear'},)
    //io.to(socket.id).emit('newUser', `Welcome New User`);
    //for connectection globally but not with newUser
  socket.broadcast.emit('newUser', { message: usersCount+'User Connected'});

    }

   

    // setInterval(() => {
    //     allMessages=[]
    // }, 10000);

    socket.on('messageFromClient',(data)=>{
        console.log(data,'=====')
    });
    

    
    socket.on('send-message',(data)=>{
        setTimeout(() => {
            socket.send(`Server Side Message`);
            allMessages.splice(2,2);
            console.log(allMessages);
        }, 10000);
        console.log(data, socket.id);
        allMessages.push({id:socket.id,messages:data}); // Push new message to the array
        if(allMessages.length>10)allMessages.splice(0,2);
        console.log(allMessages);
        
        io.sockets.emit('all-messages',{data:allMessages})
    })
    //after refresh of the page
    // we will check about disconnection   

    
     
    socket.on('disconnect',()=>{
        console.log(`User Disconnected`);
        usersCount--;
        console.log({message: usersCount},"User Connected " );
     //   socket.emit( 'BROADCAST', {message: usersCount},)
     if(usersCount>0){
        socket.broadcast.emit('newUser', { message: usersCount+'User Connected'});
     }
    
    });
    

     

    // Example: Emitting a message from server to client
    socket.emit('message', 'Hello from server!');


})



server.listen(port, ()=>{
    console.log(`Server is running at port no ${port}`);
})