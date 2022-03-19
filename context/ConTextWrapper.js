import React from "react";
import ConText from "./ConText"
import { theme } from "../utils";
export default function ContextWrapper(props){
    return (
        <ConText.Provider value={{theme}}>  
            {props.children}
        </ConText.Provider>
    )
}