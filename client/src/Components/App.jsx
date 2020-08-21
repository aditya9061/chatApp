
import React, {useState, useEffect} from 'react';
import config from '../config';
import io from 'socket.io-client';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BottomBar from './BottomBar'
import './App.css';

function App(props){
  
function scrollToBottom(){
  const chat = document.getElementById('chat');
  chat.scrollTop = chat.scrollHeight;
}

  const [control,setControl] = useState(0);
  const [bodyMsg, setBodyMsg] = useState({
    chat:[],
    content:'',
    name:''
  });

  const socket = io(config[process.env.NODE_ENV].endpoint);
  
  useEffect(()=>{
    socket.on('init',(msg)=>{
      let msgReversed = msg.reverse();
      setBodyMsg(prevValue=>{
        return {
          chat:[...prevValue.chat,...msgReversed],
          content:prevValue.content,
          name:prevValue.name
      }});
      setControl(1);
      scrollToBottom();
    });

    socket.on('push', (msg)=>{
      setBodyMsg(prevValue=>{
        return {
          ...prevValue,
          chat:[...prevValue.chat,msg],
        }
      });
      setControl(1);
      scrollToBottom();
    });

  },[control]);

 function handleInput(event){
    const {name,value} = event.target;
    setBodyMsg(prevValue=>{
     return{
       ...prevValue,
      [name]:value
    }})
 }

 function handleSubmit(event){
   event.preventDefault();

   socket.emit('message',{
     ...bodyMsg
   });

   setBodyMsg(prevValue=>{
     return {
       chat:[...prevValue.chat,{content:bodyMsg.content,name:bodyMsg.name}],
       content:'',
       name:prevValue.name
     }
   });
   setControl(0);
   scrollToBottom();
 }
  


  return (
    <div className="App">
        <Paper id="chat" elevation={3}>
          {bodyMsg.chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.name}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.content}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          content={bodyMsg.content}
          handleContent={handleInput}
          handleName={handleInput}
          handleSubmit={handleSubmit}
          name={bodyMsg.name}
        />
      </div>
  );
}

export default App;
