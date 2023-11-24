import React, { useState } from "react";
import'./modal.css';
import OtpInput from "otp-input-react";
const Smsauthverify = ({ onVerify }) =>{
    const[otp,setOtp]= useState("");

    const handleVerifyClick = () => {
        console.log(otp)
        onVerify(otp);
      };
    return(
        
        <div className="modalmain">
        <div className="modalcon">
        <div className="title">Enter OTP</div>
        
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
  </div>
 
    <button onClick={handleVerifyClick} className="submitbtn last">Verify OTP</button>
    
  
        </div>
    
    </div>
    )
}
export default Smsauthverify