import React, {useState} from "react";
import'./modal.css';
import call from './assests/call.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OtpInput from "otp-input-react";
import { useNavigate } from "react-router";

import { ToastContainer, toast } from 'react-toastify';


function Phnmodal({closemodal2}){
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [ph, setPh] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    
    const onsend= ()=>{
        setShowOTP(true)
    }
    const onverify= ()=>{
      navigate(0)
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
      
        <ToastContainer />
            </div>
        
        </div>
    )
}
export default Phnmodal;