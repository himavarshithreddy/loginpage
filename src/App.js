import './App.css';
import React, { useState, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import emailicon from './assests/email.png'
import nameicon from './assests/user.png'
import pswdicon from './assests/padlock.png'

function App() {
 const [action,setaction]=useState("Sign Up");
 const loadingBar = useRef(null);

  const handleToggle = () => {
    loadingBar.current.continuousStart();
    loadingBar.current.complete(); // Start the loading bar animation
    
  };
  return (
    <div className="App">
     <div class="triangle1"></div>
     <div class="triangle2"></div>
     <div class="triangle3"></div>
     <div class="triangle4"></div>
     <div className='container'>
      <div className='header'>
     <div className='text'>{action}</div>
     <div className='underline'></div>
     </div>
     <div className='toggle'>
      <button className={action==="Sign In"?"btn btn1 active" : "btn btn1"} onClick={()=>{setaction("Sign In"); handleToggle()} }>Sign In</button>
      <button className={action==="Sign Up"?"btn btn2 active" : "btn btn2"} onClick={()=>{setaction("Sign Up"); handleToggle()}}>Sign Up</button>
     </div>
     <div className='inputs'>
      {action==="Sign In"?<div></div>:<div className='input'>
        <img className='img' src={nameicon} alt=''/>
        <input type='text' placeholder='Name'/>
      </div>}
      
      <div className='input'>
        <img className='img' src={emailicon} alt=''/>
        <input type='email' placeholder='Email'/>
      </div>
      <div className='input'>
        <img className='img' src={pswdicon} alt=''/>
        <input type='password' placeholder='Password'/>
      </div>
      
        <button className='submitbtn'>{action}</button>
      
     </div>
      
    <div className='or'>
     or {action} with 
    </div>
     </div>
     <LoadingBar color='#91d223' ref={loadingBar} />
    </div>
  );
}

export default App;
