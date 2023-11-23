import React, {useRef} from "react";
import'./modal.css';

import 'react-phone-input-2/lib/style.css';

import LoadingBar from 'react-top-loading-bar';

import { ToastContainer } from 'react-toastify';


function Totpauthmodal({closemodal4}){
    const loadingBar = useRef(null);
   
    return(
        <div className="modalmain">
            <div className="modalcon">
                <div className="close">
            <button onClick={()=>closemodal4(false)}>X</button>
            </div>
           
            <div className="title last">Will available soon... </div>
            
           
              <LoadingBar color='#91d223' ref={loadingBar} />
        <ToastContainer />

            </div>
        
        </div>
    )
}
export default Totpauthmodal;