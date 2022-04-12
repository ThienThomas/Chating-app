import React, {createContext, useContext, useState} from 'react'
const GlobalContext = createContext({
    rooms: [], 
    setRooms: () => {}
});

const UseGlobalContext = ({children}) => {
    const [isPending, setIsPending] = useState(false);
    const [signedIn, setSignedIn] = useState(false);

    return (
        <GlobalContext.Provider 
            value={{
                isPending,
                setIsPending,
                signedIn, 
                setSignedIn
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
export {GlobalContext, UseGlobalContext}