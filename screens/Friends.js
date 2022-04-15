import React, {useState, useEffect, useContext} from "react";
import { UseGlobalContext } from "../GlobalContext";
import { auth } from "../firebase";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {doc, collection, onSnapshot, query, where} from "firebase/firestore";
import { db } from "../firebase";
import SendRequest from "./SendRequest";
import ReceivedRequest from "./ReceivedRequest";
import AllFriends from "./AllFriends";
import { Text } from "react-native";
import { View } from "react-native";
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
    const [allfr, setAllfr] = useState(1);
    const [waitforRequest, setWaitforRequest] = useState(2);
    const [invitation, setInvitation] = useState(2);
    useEffect(() => {

      const q = query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data())
        })
        setMasterDataSource(users)
      })
      return () => unsubscribe()
    }, []);
    useEffect(() => {
      const unsubscribe = () => {
        
          console.log(allfr + waitforRequest + invitation)    
      }
      return () => unsubscribe()
    }, [])
    const BarBadge = ({number}) => {
      return (
        <View style={{
          backgroundColor: '#FF5757', 
          padding: 2.5, 
          borderRadius: 100, 
          width: 20, 
          height: 20, 
          justifyContent:'center', 
          alignItems:'center',
          marginTop: 10,
          marginRight: 2
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 10}}>
            {number}
          </Text>
        </View>
      )
    }
    return (
      <Tab.Navigator>
        <Tab.Screen 
            name="allfriends" children={() => <AllFriends masterData={masterDataSource}/>}
            options={{
            tabBarBadge: () => BarBadge({number: allfr}),
            tabBarLabel: 'Tất cả',
          }}
           />
        <Tab.Screen name="sendrequest" children={() => <SendRequest masterData={masterDataSource}/>}
        options={{
          tabBarBadge: () => BarBadge({number: waitforRequest}),
          tabBarLabel: "Chờ xác nhận",
        }}/>
        <Tab.Screen
           name="receivedrequest" children={() => <ReceivedRequest masterData={masterDataSource}/>}
           options={{
            tabBarBadge:() => BarBadge({number: invitation}),
            tabBarLabel: "Lời mời",
          }}
           />
      </Tab.Navigator>
    )
}
