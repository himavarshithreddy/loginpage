import React, {useState,useRef, useEffect } from 'react';
import './dashboard.css';
import dash from './assests/dashboard.png'
import { signOut,onAuthStateChanged,getAuth,sendEmailVerification } from "firebase/auth";
import { database } from './firebase';
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css';
import { FaInfoCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { ImCross } from "react-icons/im";
import { SiVerizon } from "react-icons/si";
function Dashboard(){
    
    const navigate = useNavigate();
    const [name,setname]=useState("");
    const [email,setemail]=useState("");
    const [verified,setverification]=useState("Not Verified");
    const loadingBar = useRef(null);

    const handleClick = () =>{
        loadingBar.current.continuousStart();
        loadingBar.current.complete(); 
        toast.success("Signed Out Successfully.", {
            autoClose: 600,
            className: "toast-message",
            
          }); setTimeout(() => { 
            signOut(database).then(val=>{
                console.log(val,"val")
                navigate('/')
                
            })
        }, 1200);


    }
    const actionCodeSettings = {
      url: 'http://localhost:3000/dashboard', 
    };
const handlesend = () =>{
    const auth2 = getAuth();
    if(verified==="Not Verified"){
    sendEmailVerification(auth2.currentUser, actionCodeSettings)
    .then(() => {
      toast.success("Verification Email Sent.", {
        autoClose: 400,
        className: "toast-message",
      });
    })  }
    else{
      toast.success("Email Already Verified!", {
        autoClose: 400,
        className: "toast-message",
      });
    }
  }
    useEffect(() => {
      const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log(user.displayName)
            setname(user.displayName || ''); 
            setemail(user.email || '');
            if(user.emailVerified===false){
              setverification("Not Verified");
            }
            else{
              setverification("Verified");
            }
          } else {
           
            navigate('/');
          }
        });
    
        return () => unsubscribe(); 
      }, [navigate]);
    return(<div className="dashboard">
<div className="triangle1"></div>
     <div className="triangle2"></div>
     <div className="triangle3"></div>
     <div className="triangle4"></div>
     <div className="con">
     <div className='dheader'>
     <div className='dtext'>Dashboard</div>
     <div className='dunderline'></div>
     </div>
     <img className="dicon" width='100px' src={dash} alt=""></img>
     <ToastContainer />
     <div className='details'>Name : <span>&nbsp;&nbsp;{name}</span></div>
     <div className='details'>Email&nbsp; : <span>&nbsp;&nbsp;{email}</span></div>
     <div className='details'>Email Verification&nbsp; : <span>&nbsp;&nbsp;{verified}&nbsp;{verified==="Not Verified"?<ImCross size={15} color='#ce4d4d'/>:<SiVerizon size={15} color='#5cbb5c' />}</span></div>
     <button onClick={handlesend} className="dsendbtn">Send Email Verification</button>
     <button onClick={handleClick} className="dsubmitbtn">Sign Out</button>
    


     </div>
     <LoadingBar color='#91d223' ref={loadingBar} />
     <FaInfoCircle
        data-tooltip-content="By HimavarshithReddy"
        data-tooltip-id="tooltip"  className='info' size={20} />
         <ReactTooltip className="tooltip" id="tooltip" place="bottom" effect="solid" />
        
    </div>);
}
export default Dashboard;