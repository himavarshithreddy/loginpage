import React, {useRef} from "react";
import'./modal.css';
import { useNavigate } from 'react-router-dom';
import nameicon from './assests/user.png';
import { ToastContainer, toast } from 'react-toastify';
import { getAuth,onAuthStateChanged,updateProfile } from "firebase/auth";

function Namemodal({closename}){
    console.log("Noooooooooo")
    const navigate = useNavigate();
    const NameRef = useRef();
    const handleSubmit = () =>{
        const auth = getAuth();
        const newName = NameRef.current.value;
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              console.log(user)
              console.log(newName)
              const updateDisplayName = async (user, name) => {
                if (user) {
                  try {
                    await updateProfile(user, { displayName: name });
                  } catch (error) {
                    console.error('Error updating name:', error.message);
                    toast.error(error.message, {
                        autoClose: 600,
                        className: "toast-message",
                        
                      });
                    throw error; 
                  }
                }
              };
              await updateDisplayName(user, newName);
              navigate("./dashboard");
              
            } 
           
            
          });
        }
      
    
    return(
        <div className="modalmain">
            <div className="modalcon">
                <div className="close">
            <button onClick={()=>closename(false)}>X</button>
            </div>
            <div className="title">Enter Name to proceed</div>
            
            <div className='input'>
        <img className='img' src={nameicon} alt=''/>
        <input name='name' ref={NameRef} className='inputfld' type='text' required placeholder='Name'/>
      </div>
     
        <button onClick={handleSubmit} className="submitbtn last">Submit</button>
        
      
        <ToastContainer />
            </div>
        
        </div>
    )
}
export default Namemodal;