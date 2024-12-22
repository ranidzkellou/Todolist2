/* eslint-disable no-unused-vars */
import { useState ,useEffect} from "react";
import axios from "axios";


import Maincontent from "../components/Maincontent";
import DashMin from "../components/DashMin";
import Notification from "../components/Message";

   
function Tasks () {

  return (
    <>
                <div className="
                flex gap-3 self-start flex-row h-full w-full mt-3 overflow-hidden">
                        <Maincontent 
                        />
                    <div className="h-max w-[20%] space-y-3">
                        <DashMin />
                        <Notification />          
                    </div>
                </div>
    </>
);
  
};

export default Tasks;
