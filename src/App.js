import './App.css';
import React, { useState, useRef } from 'react';
import { database,gprovider,ghprovider,mprovider } from "./firebase";
import LoadingBar from 'react-top-loading-bar';
import emailicon from './assests/email.png';
import nameicon from './assests/user.png';
import pswdicon from './assests/padlock.png';
import call from './assests/call.png'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css';
import { FaInfoCircle } from 'react-icons/fa';
import github from './assests/github.png'
import google from './assests/google.png'
import microsoft from './assests/microsoft.png'
import Namemodal from './namemodal';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import OtpInput from "otp-input-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,updateProfile, RecaptchaVerifier, signInWithPhoneNumber, getAuth,signInWithPopup,getMultiFactorResolver,PhoneAuthProvider,PhoneMultiFactorGenerator,
} from "firebase/auth";

var zxcvbn= require("zxcvbn");

function App() {
  const[openname,setopenname]= useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
   const [ph, setPh] = useState("");
 const [action,setaction]=useState("Sign Up");
 const [score,setscore]=useState("null");
 const [phnormail , setphnormail] = useState("Phone Number");
 const loadingBar = useRef(null);

 const [visible,setvisible]=useState(false);
 const [showOTP, setShowOTP] = useState(false);



 const handlephnoremail = () => {
  handleToggle();
  
  // eslint-disable-next-line no-lone-blocks
  {phnormail==="Email"?setphnormail("Phone Number"):setphnormail("Email");}
  console.log(phnormail)
};

 const isSignUpDisabled = action === 'Sign Up' && (score !== 4 && score !== 3 && score !==2);

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

  const handleSubmit = async (e, { action }) => {
    loadingBar.current.continuousStart();
    loadingBar.current.complete(); 
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name.value;
  
    if (action === "Sign Up") {
      if (score !== 4 && score !== 3 && score !== 2) {
        toast.error("Password Requirement does not meet.", {
          autoClose: 2000,
          className: "toast-message",
        });
      } else {
        try {
          const data = await createUserWithEmailAndPassword(database, email, password);
          const user = data.user;
          await updateDisplayName(user, name);
          console.log(data, "authData");
          navigate("/dashboard");
        } catch (err) {
          handleAuthError(err);
        }
      }
    } else {
      try {
        const data = await signInWithEmailAndPassword(database, email, password);
        console.log(data, "authData");
        navigate("/dashboard");
      } catch (err) {
        handleAuthError(err);
      }
    }
  };
  
  const updateDisplayName = async (user, name) => {
    if (user) {
      try {
        await updateProfile(user, { displayName: name });
      } catch (error) {
        console.error('Error updating name:', error.message);
        throw error; 
      }
    }
  };
  
  const handleAuthError = (err) => {
    if (err.code === "auth/email-already-in-use") {
      toast.error("Email Already in Use!", {
        autoClose: 2000,
        className: "toast-message",
      });
    } else if (err.code === "auth/invalid-login-credentials") {
      toast.error("Invalid Login Credentials!", {
        autoClose: 2000,
        className: "toast-message",
      });
    } 
    else if (err.code === "auth/invalid-phone-number") {
      toast.error("Invalid Phone Number!", {
        autoClose: 2000,
        className: "toast-message",
      });
    }
    else if (err.code === "auth/invalid-verification-code") {
      toast.error("Incorrect OTP!", {
        autoClose: 2000,
        className: "toast-message",
      }); }
      else if (err.code === 'auth/multi-factor-auth-required') {
       smsauth(err)
      }
    else {
      toast.error(err.code, {
        autoClose: 2000,
        className: "toast-message",
      });
    }
  };

  const smsauth =(err)=>{
    const recaptchaVerifier2 =  new RecaptchaVerifier(auth, 'recaptcha-container2', {
      'size': "invisible"
    });

    const resolver = getMultiFactorResolver(auth, err);
    
    if (resolver.hints[0].factorId ===
      PhoneMultiFactorGenerator.FACTOR_ID) {
      const phoneInfoOptions = {
          multiFactorHint: resolver.hints[0],
          session: resolver.session
      };
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      // Send SMS verification code
      const verificationCode ="000000";
      return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier2)
          .then(function (verificationId) {
              // Ask user for the SMS verification code. Then:
              const cred = PhoneAuthProvider.credential(
                  verificationId, verificationCode);
              const multiFactorAssertion =
                  PhoneMultiFactorGenerator.assertion(cred);
              // Complete sign-in.
              return resolver.resolveSignIn(multiFactorAssertion)
          })
          .then(function (userCredential) {
             console.log(userCredential)
             navigate("/dashboard")
          });
  }
  }
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': "invisible"
    });
  }
  
    }
  
  function onSignup() {
    
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(database, formatPh, appVerifier)
      .then((confirmationResult) => {
        handleToggle();
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
      
        toast.success("OTP sent Successfully!", {
          autoClose: 2000,
          className: "toast-message",
        });
      })
      .catch((error) => {
        handleAuthError(error);
        console.log(error);
        
      });

      
  }

  function onOTPVerify() {
    
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
      if(action==="Sign Up"){
        const name = document.getElementById('name').value;
        
        await updateDisplayName(res.user, name);
      }
      const user2 = res.user;
      if(user2.displayName===null){
        window.recaptchaVerifier = null;
        setopenname(true)
        
      }else{
  window.recaptchaVerifier = null;
  handleToggle();
        navigate("/dashboard");}
      })
      .catch((err) => {
        handleAuthError(err);
        console.log(err);
      
      });
  }
  const handlegoogle = () =>{
    signInWithPopup(database,gprovider).then((data)=>{
      console.log(data)
      navigate("/dashboard");
    }).catch((err) => {
      handleAuthError(err);
      console.log(err);
    
    });
  }
  const handlegithub = () =>{
    signInWithPopup(database,ghprovider).then((data)=>{
      console.log(data)
      navigate("/dashboard");
    }).catch((err) => {
      handleAuthError(err);
      console.log(err);
    
    });
  }
  const handlemicrosoft = () =>{
    signInWithPopup(database,mprovider).then((data)=>{
      console.log(data)
      navigate("/dashboard");
    }).catch((err) => {
      handleAuthError(err);
      console.log(err);
    
    });
  }

  return (
    
    <div className="App">
      
     <div className="triangle1"></div>
     <div className="triangle2"></div>
     <div className="triangle3"></div>
     <div className="triangle4"></div>
     <div className='container'>
      <div className='header'>
     <div className='text'>{action}</div>
     <div className='underline'></div>
     </div>
     <div className='toggle'>
      <button className={action==="Sign In"?"btn btn1 active" : "btn btn1"} onClick={()=>{setaction("Sign In"); handleToggle()} }>Sign In</button>
      <button className={action==="Sign Up"?"btn btn2 active" : "btn btn2"} onClick={()=>{setaction("Sign Up"); handleToggle()}}>Sign Up</button>
     </div>
     {phnormail ==="Phone Number"?<>
    
     <div className='inputs'>
     <form className='form' onSubmit={(e) => handleSubmit(e, {action})}>
      {action==="Sign In"?<div></div>:<div className='input'>
        <img className='img' src={nameicon} alt=''/>
        <input name='name' className='inputfld' type='text'required placeholder='Name'/>
      </div>}
      
      <div className='input'>
        <img className='img' src={emailicon} alt=''/>
        <input name='email' className='inputfld' type='email' required placeholder='Email'/>
      </div>
      <div className='inputp '>
        <div className='p'>
        <img className='img' src={pswdicon} alt=''/>
        <div className='pswdin'>
        <input name='password' className='pswdfld' type={visible ? "text":"password"} autoComplete="off" id='password' onChange={testpswdstr}  placeholder='Password'/>
        <span className='eye' onClick={()=>setvisible(!visible)}>
          {visible ? <FaEyeSlash /> : <FaEye />}
        </span>
        </div>
        </div>
        {action==="Sign Up" ? <span
        className="strength-password"
        data-score={score}
      />:<div></div>}
      <div className='askphn'>
       <div onClick={handlephnoremail} className='usephn'>Use {phnormail} Instead</div>
       </div>
      </div>
       <button type='submit' className={isSignUpDisabled ? 'submitbtn dis' : 'submitbtn'}>{action}</button>
      </form>
      <ToastContainer />
      
     </div>
     </>:<>
     <div className='inputs'>
     {action==="Sign In"?<div></div>:<div className='input'>
        <img className='img' src={nameicon} alt=''/>
        <input name='name' className='inputfld' id='name' type='text'required placeholder='Name'/>
      </div>}
      <div className='input splinpput'>
        <img className='img' src={call} alt=''/>
        <div>
        <label>
        <PhoneInput className="phninput" country={"in"} value={ph} onChange={setPh} />
        </label>
        <div className='askphn'>
       <div onClick={handlephnoremail} className='usephn'>Use {phnormail} Instead</div>
       </div>     
        </div>
      </div>
      <div id="recaptcha-container"></div>
      <div id="recaptcha-container2"></div>
      <button  onClick={onSignup}  className='submitbtn'>Send Code via SMS</button>
      <ToastContainer />
     
      
      {showOTP?
      
      <>
       <p className='otptext'>Enter OTP</p>
       <div className='input'>
       
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="otp "
                ></OtpInput>
              </div><button onClick={onOTPVerify} className='submitbtn last'>Verify OTP</button></>:<div></div>}
      
     </div>
     </>}
     {showOTP?<div></div>:<> <div className='or'>
     or {action} with 
    </div>
    <div className='sociallogin'>
    
    <img onClick={handlegoogle} data-tooltip-content="Login with Google"
        data-tooltip-id="tooltip2"  className='socialimg' src={google} alt=''/>
    <img onClick={handlegithub} data-tooltip-content="Login with Github"
        data-tooltip-id="tooltip3"  className='socialimg' src={github} alt=''/>
    <img  onClick={handlemicrosoft} data-tooltip-content="Login with Microsoft"
        data-tooltip-id="tooltip4"  className='socialimg'src={microsoft} alt=''/>
  
    </div>
    </>}
    
     </div>
     {openname && <Namemodal closename={setopenname}/>}
     <LoadingBar color='#91d223' ref={loadingBar} />
     <FaInfoCircle
        data-tooltip-content="By HimavarshithReddy"
        data-tooltip-id="tooltip1"  className='info' size={20} />
         <ReactTooltip className="tooltip" id="tooltip1" place="top" effect="solid" />
    </div>
  );
  
  
}

export default App;
