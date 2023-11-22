import React, {useState,useRef} from "react";
import'./modal.css';
import { database } from "./firebase";
import call from './assests/call.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OtpInput from "otp-input-react";
import { useNavigate } from "react-router";
import LoadingBar from 'react-top-loading-bar';
import {
 RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  updatePhoneNumber
} from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';


function Phnmodal({closemodal2}){

    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [ph, setPh] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const loadingBar = useRef(null);
    const auth = getAuth();
    const handleToggle = () => {
      loadingBar.current.continuousStart();
      loadingBar.current.complete(); 
      
    };
    const onsend= ()=>{
      handleToggle();
      const formatPh = "+" + ph;
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': "invisible"
      });
      const appVerifier = window.recaptchaVerifier;
      handleToggle();
      signInWithPhoneNumber(database, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
        toast.success("OTP sent Successfully!", {
          autoClose: 2000,
          className: "toast-message",
        });
      })
      .catch((error) => {
        toast.error(error.code, {
          autoClose: 2000,
          className: "toast-message",
        });
        
      });

     
    }
    const onverify= ()=>{
      handleToggle();
      window.recaptchaVerifier = null;
      const user = auth.currentUser;
      const credential = PhoneAuthProvider.credential(window.confirmationResult.verificationId, otp);
      updatePhoneNumber(user, credential)
      .then(() => {
        console.log('Phone number updated successfully.');
          toast.success("Please Wait while updating!", {
          autoClose: 8000,
          className: "toast-message",
        });
        // Additional actions after the phone number is successfully updated
      })
      .catch((error) => {
        console.error('Error updating phone number:', error.message);
        toast.error(error.code, {
          autoClose: 2000,
          className: "toast-message",
        });
        // Handle the error as needed
      });
  
      setTimeout(() => {
        navigate(0)
      }, 5000);
     
    }
    return(
        <div className="modalmain">
            <div className="modalcon">
                <div className="close">
            <button onClick={()=>closemodal2(false)}>X</button>
            </div>
            <div className="title">Enter Phone number</div>
            
            <div className='input'>
            <div className='input splinpput'>
        <img className='img' src={call} alt=''/>
        <div>
        <label>
        <PhoneInput className="phninput" country={"in"} value={ph} onChange={setPh} />
        </label>   
        </div>
      </div>
      <div id="recaptcha-container"></div>
      
        
      </div>
     
      <button onClick={onsend} className='submitbtn last'>Send Code via SMS</button>
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
              </div><button onClick={onverify} className='submitbtn last'>Verify OTP</button></>:<div></div>}
              <LoadingBar color='#91d223' ref={loadingBar} />
        <ToastContainer />
            </div>
        
        </div>
    )
}
export default Phnmodal;