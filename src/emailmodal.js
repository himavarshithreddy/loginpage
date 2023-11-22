import React from "react";
import'./modal.css';
import emailicon from './assests/email.png';
import { ToastContainer, toast } from 'react-toastify';
import { getAuth,onAuthStateChanged,verifyBeforeUpdateEmail } from "firebase/auth";

function Emailmodal({closemodal1}){

 
    const actionCodeSettings = {
      
        url : 'http://localhost:3000/dashboard'
     };
    const handleSubmit = () =>{
        const auth = getAuth();
        const newEmail = document.getElementById("email").value;
        console.log(newEmail);  
          onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log(user)
              console.log(newEmail)
              verifyBeforeUpdateEmail(user, newEmail,actionCodeSettings)
                .then(() => {
                    console.log('Email updated successfully');
                    toast.success("Verify Email to take Update. Check your Inbox.", {
                        className: "toast-message",
                        
                      });
                    closemodal1(false);

                })
                .catch((error) => {
                    console.error('Error updating email:', error.message);
                    toast.error(error.message, {
                        autoClose: 600,
                        className: "toast-message",
                        
                      });
                });
              
            } 
            
          });
        }
      
    
    return(
        <div className="modalmain">
            <div className="modalcon">
                <div className="close">
            <button onClick={()=>closemodal1(false)}>X</button>
            </div>
            <div className="title">Enter Email to proceed</div>
            
            <div className='input'>
        <img className='img' src={emailicon} alt=''/>
        <input name='email' id="email"  className='inputfld' type='email' required placeholder='Email'/>
      </div>
     
        <button onClick={handleSubmit} className="submitbtn last">Submit</button>
        
      
        <ToastContainer />
            </div>
        
        </div>
    )
}
export default Emailmodal;