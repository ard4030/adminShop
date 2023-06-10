import axios from "axios";
import React,{ createContext, useContext , useState , useEffect } from "react";
import Dashboard from "../Components/Dashboard";

const ViewContext = createContext();

export const ViewProvider = ({children}) => {
    const [show, setShow] = useState({
        name:'داشبورد',
        comp:<Dashboard />,
        id:null
    })


    const SettingShow = (e) => {
        setShow(e)
    }   

    return (
        <ViewContext.Provider value={{ show,SettingShow}}>
            {children}
        </ViewContext.Provider>
    )
}

export default ViewContext;