const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

const Message = require('./Message');
const mongoose = require('mongoose');

mongoose.connect(uri, {
    useUnifiedTopology:true,
    useNewUrlParser:true
});

app.use(express.static(path.join(__dirname,'..','client','build')));

io.on('connection',(socket)=>{

    Message.find().sort({createdAt:-1}).limit(10).exec((err,messages)=>{
        if(err) return console.log(err);

        socket.emit('init',messages);
    });

    socket.on('message',(msg)=>{
        const message = new Message({
            name:msg.name,
            content:msg.content
        });

        message.save((err)=>{
            if(err) return console.log(err);
        });

        socket.broadcast.emit('push',msg);
    });
});

http.listen(port,()=>{
    console.log('Server started on ' + port);
});