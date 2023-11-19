import React, {useRef } from 'react';
import './dashboard.css';
import dash from './assests/dashboard.png'
import { signOut } from "firebase/auth";
import { database } from './firebase';
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css';
import { FaInfoCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';

function Dashboard(){
    const navigate = useNavigate();
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
    return(<div className="dashboard">
<div class="triangle1"></div>
     <div class="triangle2"></div>
     <div class="triangle3"></div>
     <div class="triangle4"></div>
     <div className="con">
     <div className='dheader'>
     <div className='dtext'>Dashboard</div>
     <div className='dunderline'></div>
     </div>
     <img className="dicon" width='100px' src={dash} alt=""></img>
     <ToastContainer />
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