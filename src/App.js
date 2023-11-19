import './App.css';
import React, { useState, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import emailicon from './assests/email.png';
import nameicon from './assests/user.png';
import pswdicon from './assests/padlock.png';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

var zxcvbn= require("zxcvbn");

function App() {
  const navigate = useNavigate();
 const [action,setaction]=useState("Sign Up");
 const [score,setscore]=useState("null");
 const loadingBar = useRef(null);

 const [visible,setvisible]=useState(false);
 const isSignUpDisabled = action === 'Sign Up' && (score !== 4 && score !== 3);

  const handleToggle = () => {
    loadingBar.current.continuousStart();
    loadingBar.current.complete(); 
    
  };
  const testpswdstr = (e) => {
    if (e.target.value !== "") {
      let pass = zxcvbn(e.target.value)
      setscore(pass.score)
    }else{
      setscore("null")
    }
  }
  const handleSignUp = () => {
    if (score !== 4 && score !== 3) {
      toast.error("Password Requirement does not meet.", {
        autoClose: 2000,
        className: "toast-message",
      });} else {
      // Add your logic for handling successful sign-up
      navigate("/dashboard");
    }
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
        <input className='inputfld' type='text'required placeholder='Name'/>
      </div>}
      
      <div className='input'>
        <img className='img' src={emailicon} alt=''/>
        <input className='inputfld' type='email' required placeholder='Email'/>
      </div>
      <div className='inputp '>
        <div className='p'>
        <img className='img' src={pswdicon} alt=''/>
        <div className='pswdin'>
        <input className='pswdfld' type={visible ? "text":"password"} autocomplete="off" id='password' onChange={testpswdstr}  placeholder='Password'/>
        <span className='eye' onClick={()=>setvisible(!visible)}>
          {visible ? <FaEyeSlash /> : <FaEye />}
        </span>
        </div>
        </div>
        {action==="Sign Up" ? <span
        className="strength-password"
        data-score={score}
      />:<div></div>}
       
      </div>
      {action==="Sign In"? <button className='submitbtn'>{action}</button>: <button  onClick={handleSignUp} className={isSignUpDisabled ? 'submitbtn dis' : 'submitbtn'}>{action}</button>}
      <ToastContainer />
      <GoogleOAuthProvider clientId="260684329336-k6iq17cretjcqdjo3muuorsukjhtbqof.apps.googleusercontent.com">
      <GoogleLogin
  onSuccess={credentialResponse => {
    const decoded = jwtDecode(credentialResponse.credential);

    console.log(decoded);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>;
        
        </GoogleOAuthProvider>;
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
