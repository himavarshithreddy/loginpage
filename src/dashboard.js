import React, {useState,useRef, useEffect } from 'react';
import './dashboard.css';
import dash from './assests/dashboard.png'
import { signOut,onAuthStateChanged,getAuth,sendEmailVerification, deleteUser  } from "firebase/auth";
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
import Emailmodal from './emailmodal';
import Dropdown from 'react-dropdown';
import Phnmodal from './phonemodal';
import Totpauthmodal from './totpauthmodal';
import Smsauthmodal from './smsauthmodal';
import 'react-dropdown/style.css';
function Dashboard(){
  
    const[openmodal,setopenmodal]= useState(false)
    const[totpmodal,setopentotpmodal]= useState(false)
    const[openphone,setopenphone]= useState(false)
    const[opensmsauth,setopensmsauth]= useState(false)
    const[phnlogin,setphnlogin]= useState("")
    const navigate = useNavigate();
    const [name,setname]=useState("");
    const [email,setemail]=useState("");
    const [phnnum,setphnnum]=useState("");
    const [verified,setverification]=useState("Not Verified");
    const loadingBar = useRef(null);
const handlephn = ()=>{
setopenphone(true)
}

const options = [
  'SMS Authentication', 'Authenticater App'
];

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
      
       url : 'https://loginapp.himavarshithreddy.in/dashboard'
    };
const handlesend = () =>{
  if(email==="Not available"){
    setopenmodal(true);
  }
  else{
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
      
    }}
 

}
    useEffect(() => {
      const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log(user)
            setname(user.displayName || "Not available"); 
            setemail(user.email || "Not available");
            setphnnum(user.phoneNumber || "Not available")
            setphnlogin(user.providerData[0].providerId);
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
      const handledelete = ()=>{
        const auth3 = getAuth();
const user = auth3.currentUser;
loadingBar.current.continuousStart();
loadingBar.current.complete(); 
toast.success("Account Deleted!.", {
    autoClose: 600,
    className: "toast-message",
    
  }); 
setTimeout(() => {
deleteUser(user).then(() => {
navigate("/");
}).catch((error) => {
  toast.error(error.code, {
    autoClose: 600,
    className: "toast-message",
    
  }); 
});
}, 1200);

      }

          const handleDropdownChange = (selectedOption) => {
          if(selectedOption.value==="SMS Authentication"){
            if(phnlogin==='phone'){
              toast.error("Already  logged in with Phone", {
                autoClose: 2000,
                className: "toast-message",
              });
            }
            else{
            if(verified==="Not Verified" || phnnum==="Not available" ){
              toast.error("Verify Email and Add Phone number before Enabling 2FA!", {
                autoClose: 3000,
                className: "toast-message",
              });
            }
            else{
          
              loadingBar.current.continuousStart();
    loadingBar.current.complete(); 
              setopensmsauth(true);
           
           
          }
          }
        }
        else if(selectedOption.value==="Authenticater App"){
          setopentotpmodal(true)
        }
          };



    return(<div className="dashboard">
     
<div className="dtriangle1"></div>
     <div className="dtriangle2"></div>
     <div className="dtriangle3"></div>
     <div className="dtriangle4"></div>
     <div className="con">
      <div id='recaptcha-container'></div>
     <div className='dheader'>
     <div className='dtext'>Dashboard</div>
     <div className='dunderline'></div>
     </div>
     <img className="dicon" width='100px' src={dash} alt=""></img>
     <ToastContainer />
     <div className='details'>Name : <span>&nbsp;&nbsp;{name}</span></div>
     <div className='details'>Email&nbsp; : <span>&nbsp;&nbsp;{email}</span></div>
     <div className='details spclfont'>Phone Number&nbsp; : <span>&nbsp;&nbsp;{phnnum}</span></div>
     <div className='details'>Email Verification&nbsp; : <span>&nbsp;&nbsp;{verified}&nbsp;{verified==="Not Verified"?<ImCross size={15} color='#ce4d4d'/>:<SiVerizon size={15} color='#5cbb5c' />}</span></div>
  
    {openmodal && <Emailmodal closemodal1={setopenmodal}/>}
    {openphone && <Phnmodal closemodal2={setopenphone}/>}
    {opensmsauth && <Smsauthmodal closemodal3={setopensmsauth}/>}
    {totpmodal && <Totpauthmodal closemodal4={setopentotpmodal}/>}

     </div>
     <div className='buttoncon'>
      <div className='btncon'>
    
    {verified==="Not Verified" && <button onClick={handlesend} className="dsendbtn">Verify Email</button>}
    {phnnum==="Not available" && <button onClick={handlephn} className="dsendbtn">Add Phone Number</button>}
    <Dropdown onChange={handleDropdownChange}  options={options} className='dropdown'   placeholder="2 factor Auth Options" />
  
    </div>
    <div className='btncon'>
     <button onClick={handleClick} className="dsubmitbtn">Sign Out</button>
     <button onClick={handledelete} className="dsubmitbtn">Delete Account</button>
    
     </div>
     </div>
     <LoadingBar color='#91d223' ref={loadingBar} />
     <FaInfoCircle
        data-tooltip-content="By HimavarshithReddy"
        data-tooltip-id="tooltip"  className='info' size={20} />
         <ReactTooltip className="tooltip" id="tooltip" place="bottom" effect="solid" />
        
    </div>);
}
export default Dashboard;