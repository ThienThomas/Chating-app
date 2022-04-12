import React, {useState, useEffect, useContext} from "react";
import { UseGlobalContext } from "../GlobalContext";
import { auth } from "../firebase";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { collection, onSnapshot, query, where} from "firebase/firestore";
import { db } from "../firebase";
import SendRequest from "./SendRequest";
import ReceivedRequest from "./ReceivedRequest";
import AllFriends from "./AllFriends";
const Tab = createMaterialTopTabNavigator()
export default function Chats(){
  return (
    <UseGlobalContext>
      <ListChats></ListChats>
    </UseGlobalContext>
  )
}
function  ListChats(){
    const [masterDataSource, setMasterDataSource] = useState([]);
    useEffect(() => {
      const q = query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data())
        })
        setMasterDataSource(users)
        //console.log(masterDataSource)
      })
    }, []);
    return (
      <Tab.Navigator>
        <Tab.Screen 
          name="allfriends" children={() => <AllFriends masterData={masterDataSource}/>}
          options={{
          tabBarLabel: "Tất cả",
          }}
           />
        <Tab.Screen name="sendrequest" children={() => <SendRequest masterData={masterDataSource}/>}
        options={{
          tabBarLabel: "Chờ xác nhận",
        }}/>
        <Tab.Screen
           name="receivedrequest" children={() => <ReceivedRequest masterData={masterDataSource}/>}
           options={{
            tabBarLabel: "Lời mời",
          }}
           />
      </Tab.Navigator>
    )
}
