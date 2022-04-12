import React, {useState, useEffect} from "react";
import { View, Text, Dimensions} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../elements/FriendsAvatar";
import { auth } from "../firebase";
import { StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { collection, onSnapshot, query,  where} from "firebase/firestore";
import { db } from "../firebase";
import {acceptRequest, denyRequest } from "../mymodules/FriendsTabProcessing";

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5
    },
    tabcontainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    button: {
      borderRadius: 100, 
      paddingLeft: 10, 
      paddingRight: 10, 
      paddingTop: 5, 
      paddingBottom: 5,
    },
      sendingRequest: { 
        backgroundColor: "#1590C4"},
      revokeRequest:{ 
        backgroundColor: "#FF5757"
      },
      textingme: {
        backgroundColor: "#FF5757"
      },
      accept: {
        backgroundColor: "green"
      }
  })
export default function ReceivedRequest({masterData}){
    const [receivedRequest, setReceivedRequest] = useState([])
    useEffect(() => {
      const q1 = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
        let request = []
        //console.log(request)
        querySnapshot.forEach((doc) => {
          request = doc.data().receivedRequest
        })
        setReceivedRequest(request)
        //console.log(sendRequest)
        request = []
      })
    }, []);
      const ItemView = ({item}) => {
        return (
          <>
          {typeof receivedRequest !== 'undefined' && receivedRequest.find(element => element === item.uid) ? (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
            width: Dimensions.get('window').width * 0.95
           }}> 
            <FriendsAvatar
              Img={!item.photo === "none" ? require('../assets/user_no_avatar.jpg') : item.photoURL}
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
            <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity 
                    style={{ borderRadius: 100, 
                    paddingLeft: 10, 
                    paddingRight: 10, 
                    paddingTop: 5, 
                    paddingBottom: 5,
                    backgroundColor: "#FF5757"}}
                    onPress={() => denyRequest(item)}
            >
              <AntDesign name="deleteuser" size={25} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.button, styles.accept]}
                  onPress={() => acceptRequest(item)}
              >
              <AntDesign name="check" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>) : (<></>)
          }
          </>
        );
    };
    return (
      <View style={styles.container}>
        <FlatList
            data={masterData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}  
            showsHorizontalScrollIndicator={false}  
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 85, padding: 10}}
        >
        </FlatList>
      </View>
      )
  }