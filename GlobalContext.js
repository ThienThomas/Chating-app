import { collection, onSnapshot, query, where, getDocsFromServer, getDocsFromCache } from 'firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react'
//import { auth, db } from './firebase';
import { auth, db } from './firebase';
import NotificationsOfNewmess from './mymodules/LocalNotification';
const GlobalContext = createContext({
    rooms: [], 
    setRooms: () => {}
});

const UseGlobalContext = ({children}) => {
    const [isPending, setIsPending] = useState(false);
    const [signedIn, setSignedIn] = useState(false);
    const [userInfo, setUserInfo] = useState([])
    const [notifications, setNotifications] = useState(true)
    const [chatRooms, setChatRooms] = useState([])
    const [masterData, setMasterData] = useState([])
    const [receivedRequest, setReceivedRequest] = useState([])
    const [sendingRequest, setSendingRequest] = useState([])
    const [listFriends, setListFriends] = useState([])
    const [listChats, setListChats] = useState([])
    const [isBusy, setIsBusy] = useState(true)
    //const [masterDataSource, setMasterDataSource] = useState([])
    async function getdocfromServer() {
        const colRef = query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid))
        let Docs = await getDocsFromCache(colRef)
        let users = []
        Docs.forEach((doc) => {
            users.push(doc.data())
        })
        setMasterData(users)
        //console.log(users)
        //Tin nhắn mới nhất
            const colRef2 = query(collection(db, "chatrooms"), where("participants", 'array-contains', auth.currentUser.uid))
            let Docs1 = await getDocsFromCache(colRef2)
            let chatrooms = []
            Docs1.docs.map((doc) => {
                chatrooms.push(doc.data())
            })
            setChatRooms(chatrooms)
            
        const colRef3 = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        let Docs2 = await getDocsFromCache(colRef3)
        let ListC = [] 
        let ListF = []
        let ListS = []
        let ListR = []
        Docs2.forEach((doc) => {
            ListC = doc.data().listchats
            ListF = doc.data().listfriends
            ListS = doc.data().SendRequest
            ListR = doc.data().receivedRequest
        })
        setListChats(ListC)
        setListFriends(ListF)
        setSendingRequest(ListS)
        setReceivedRequest(ListR)
    }
    /*useState(() => {
        getdocfromServer()
    })*/
    useState(() => {
        if (auth.currentUser){
            setIsBusy(true)
            const q = query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let users = []
                querySnapshot.forEach((doc) => {
                    users.push(doc.data())
                })
                setMasterData(users)
            })
            setIsBusy(false)
            return () => unsubscribe()
        }
    })
    useState(() =>{   
        if (auth.currentUser){
            setIsBusy(true)
            const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let user = [];
                querySnapshot.forEach((doc) => {
                    user = doc.data()
                })
                setUserInfo(user)
            })
            setIsBusy(false)
            return () =>  unsubscribe()
        }
    })

    useState(() => {
        if (auth.currentUser){
            setIsBusy(true)
            const q = query(collection(db, "chatrooms"), where("participants", 'array-contains', auth.currentUser.uid))
            onSnapshot(q, (querySnapshot) => {
                let rooms = []
                querySnapshot.forEach((doc) => {
                    rooms.push(doc.data())
                })
                rooms.sort((a, b) => {
                    return b.lastmessage.createdAt - a.lastmessage.createdAt
                })
                setChatRooms(rooms)
                /*querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "modified") {
                        console.log(change.doc.data())
                        //NotificationsOfNewmess()
                    }
                })*/
            })
            setIsBusy(false)
            return () => unsubscribe()
        }
    })
    useState(() => {
        if (auth.currentUser) {
            setIsBusy(true)
            const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let ListC = [] 
                let ListF = []
                let ListS = []
                let ListR = []
                querySnapshot.forEach((doc) => {
                    ListC = doc.data().listchats
                    ListF = doc.data().listfriends
                    ListS = doc.data().SendRequest
                    ListR = doc.data().receivedRequest
                })
                setListChats(ListC)
                setListFriends(ListF)
                setSendingRequest(ListS)
                setReceivedRequest(ListR)
            })
            setIsBusy(false)
            return () => unsubscribe()
            
        }
    })
    return (
        <GlobalContext.Provider 
            value={{
                isPending,
                setIsPending,
                signedIn, 
                setSignedIn,
                userInfo,
                notifications,
                setNotifications,
                masterData,
                chatRooms,
                listFriends,
                listChats,
                isBusy,
                sendingRequest,
                receivedRequest,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
export {GlobalContext, UseGlobalContext}