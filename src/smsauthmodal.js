import React, {useState,useRef,useEffect} from "react";
import'./modal.css';
import 'react-phone-input-2/lib/style.css';
import OtpInput from "otp-input-react";
import { useNavigate } from "react-router";
import LoadingBar from 'react-top-loading-bar';
import {
 RecaptchaVerifier,
  getAuth,
  PhoneAuthProvider,
   multiFactor,
   PhoneMultiFactorGenerator,onAuthStateChanged
} from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';


function Smsauthmodal({closemodal3}){

    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [ph, setPh] = useState("");
    const[smsauth,setsmsauth]= useState("")
   
    const [showOTP, setShowOTP] = useState(false);
    const loadingBar = useRef(null);
    const auth = getAuth();
    const handleToggle = () => {
      loadingBar.current.continuousStart();
      loadingBar.current.complete(); 
      
    };
    const disablesms =()=>{
        const user = auth.currentUser;
        const multiFactorUser = multiFactor(user);
        var options = multiFactor(user).enrolledFactors;
        multiFactorUser.unenroll(options[0])
        .then(() => {
            toast.success("Successfully disabled SMS 2FA!", {
                autoClose: 1400,
                className: "toast-message",
              });
              setTimeout(() => {
                navigate(0)
              }, 1400);
              
        })
        .catch((error) => {
            if(error.code==="auth/requires-recent-login"){
                toast.error("Disabling 2FA needs recenet login. Try again by logging in!", {
                    autoClose: 3500,
                    className: "toast-message",
                  });
            }
            else{
            toast.error(error.code, {
                autoClose: 2000,
                className: "toast-message",
              });
              console.log(error)
            }
        });
    }
    useEffect(() => {
        const auth = getAuth();
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              setPh(user.phoneNumber);
              const multiFactorUser = multiFactor(user);
              if(multiFactorUser.enrolledFactors.length > 0){
                for (const factor of multiFactorUser.enrolledFactors) {
                  if (factor.displayName === "SMS") {
                    setsmsauth(true)
                    break; 
                  }
                  else{
                    setsmsauth(false)
                  }
                }
                
              }
  
              
            } else {
             
              navigate('/');
            }
          });
      
          return () => unsubscribe(); 
        });
    const onsend= ()=>{
      handleToggle();
      const formatPh = ph;
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': "invisible"
      });
      const appVerifier = window.recaptchaVerifier;
      handleToggle();
  
      const user = auth.currentUser;
      multiFactor(user).getSession()
    .then(function (multiFactorSession) {
        // Specify the phone number and pass the MFA session.
        const phoneInfoOptions = {
            phoneNumber: formatPh,
            session: multiFactorSession
        };

        const phoneAuthProvider = new PhoneAuthProvider(auth);

        // Send SMS verification code.
        return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier);
    }).then((verificationId)=> {
      window.confirmationResult = verificationId;
      setShowOTP(true);
      toast.success("OTP sent Successfully!", {
            autoClose: 2000,
            className: "toast-message",
          });
        })
        .catch((error) => {
        if(error.code==="auth/unsupported-first-factor"){
          toast.error("Relogin to enable 2FA", {
            autoClose: 2000,
            className: "toast-message",
          });
        }
        else{
          toast.error(error.code, {
            autoClose: 2000,
            className: "toast-message",
          });
        }
  });

     
    }
    const onverify= ()=>{
      handleToggle();
      window.recaptchaVerifier = null;
      const user = auth.currentUser;
      const cred = PhoneAuthProvider.credential(window.confirmationResult, otp);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      // Complete enrollment.
      multiFactor(user).enroll(multiFactorAssertion, "SMS").then(() => {
          handleToggle();
          toast.success("SMS 2FA Enabled !", {
              autoClose: 3000,
              className: "toast-message",
            });
        })
        .catch((error) => {
          toast.error(error.message, {
              autoClose: 2000,
              className: "toast-message",
            });
        });
        setTimeout(() => {
          navigate(0)
        }, 3500);
  
     
    }
    return(
        <div className="modalmain">
            <div className="modalcon">
                <div className="close">
            <button onClick={()=>closemodal3(false)}>X</button>
            </div>
            {!smsauth?<>
            <div className="title">Enable SMS 2FA</div>
            
            <div className='input'>
          
      <div id="recaptcha-container"></div>
      
        
      </div>
     
      <button onClick={onsend} className='submitbtn last'>Send Code via SMS</button>
      {showOTP?
      
      <>
       <p className='otptext'>Enter OTP sent to {ph}</p>
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
</>:<div className="input">
    
    <button onClick={disablesms} className="submitbtn last">Disable SMS 2 FA</button>
    </div>}
            </div>
        
        </div>
    )
}
export default Smsauthmodal;