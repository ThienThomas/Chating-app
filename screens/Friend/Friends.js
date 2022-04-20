import React, {useState, useEffect, useContext} from "react";
import { GlobalContext, UseGlobalContext } from "../../GlobalContext";
import { auth } from "../../firebase";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {doc, collection, onSnapshot, query, where} from "firebase/firestore";
import { db } from "../../firebase";
import SendRequest from "./SendRequest";
import ReceivedRequest from "./ReceivedRequest";
import AllFriends from "./AllFriends";
import { Text } from "react-native";
import { View } from "react-native";
const Tab = createMaterialTopTabNavigator()
export default function Friends(){
  return (
    <UseGlobalContext>
      <ListFriends></ListFriends>
    </UseGlobalContext>
  )
}
function  ListFriends(){
    const globalContext = useContext(GlobalContext)
    const [allfr, setAllfr] = useState(1);
    const [waitforRequest, setWaitforRequest] = useState(2);
    const [invitation, setInvitation] = useState(2);
    /*useEffect(() => {
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
    }, [])*/
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
    /*const ItemView = ({item}) => {
      return (
      <View style={styles.tabcontainer}>
        <FriendsAvatar
          Img={!item.photoURL === "none" ? require('../../assets/user_no_avatar.jpg') : item.photoURL}
          Width={55}
          Height={55}
        />
        <View style={{marginLeft: 15, marginRight: 15, width: Dimensions.get('window').width * 0.55}}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
            {item.displayName}
        </Text>
        <Text>
            {item.email}
        </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          {(isBusy === false && typeof sendRequest === 'undefined') ? (
          <>
            <TouchableOpacity 
              style={[styles.sendingRequest, styles.button]}
              onPress={() => sendingRequest(item)}
            >
            <AntDesign name="adduser" size={25} color="white" />
            </TouchableOpacity>
          </>
          ) : 
          (<>
            {sendRequest.find(element => element === item.uid) ? 
              (<>
               <TouchableOpacity 
                style={[styles.revokeRequest, styles.button]}
                onPress={() => revokeRequest(item)}
                >
                <AntDesign name="deleteuser" size={25} color="white" />
                </TouchableOpacity>
              </>) : (
                  <>
                    {typeof listFriends === 'undefined' ? (<></>) : (<>{listFriends.find(element => element === item.uid) ? (<>
                      <TouchableOpacity style={[styles.textingme, styles.button]}>
                        <AntDesign name="message1" size={25} color="white" />
                    </TouchableOpacity>
                    </>) : (<>
                      <TouchableOpacity 
                        style={[styles.sendingRequest, styles.button]}
                        onPress={() => sendingRequest(item)}
                      >
                        <AntDesign name="adduser" size={25} color="white" />
                        </TouchableOpacity>
                      </>)}
                  </>)}
              </>)
            }
          </>)}
        </View>
      </View>
      );
    };*/
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {backgroundColor: "#42C2FF"}
        }}
      >
        <Tab.Screen 
          name="allfriends" children={() => <AllFriends masterData={globalContext.masterData} />}
          options={{
            tabBarBadge: () => BarBadge({number: allfr}),
            tabBarLabel: 'Tất cả',
          }}
           />
        <Tab.Screen name="sendrequest" children={() => <SendRequest masterData={globalContext.masterData} sendingRequest={globalContext.sendingRequest}/>}
        options={{
          tabBarBadge: () => BarBadge({number: waitforRequest}),
          tabBarLabel: "Chờ xác nhận",
        }}/>
        <Tab.Screen
          name="receivedrequest" children={() => <ReceivedRequest masterData={globalContext.masterData} receivedRequest={globalContext.receivedRequest}/>}
          options={{
            tabBarBadge:() => BarBadge({number: invitation}),
            tabBarLabel: "Lời mời",
          }}
           />
      </Tab.Navigator>
    )
}
