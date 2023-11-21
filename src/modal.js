import React from "react";
import'./modal.css';
import emailicon from './assests/email.png';

function Modal({closemodal}){
    return(
        <div className="modalmain">
            <div className="modalcon">
                <div className="close">
            <button onClick={()=>closemodal(false)}>X</button>
            </div>
            <div className="title">Enter Email to proceed</div>
            
            <div className='input'>
        <img className='img' src={emailicon} alt=''/>
        <input name='email' className='inputfld' type='email' required placeholder='Email'/>
      </div>
     
        <button  className="submitbtn last">Submit</button>
        
      
           
            </div>
        
        </div>
    )
}
export default Modal;