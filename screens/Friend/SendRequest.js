import React, {useState, useEffect, useContext} from "react";
import { View, Text, Dimensions} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { auth } from "../../firebase";
import { StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { collection, onSnapshot, query, where} from "firebase/firestore";
import { db } from "../../firebase";
import { Swipeable } from "react-native-gesture-handler";
import { revokeRequest } from "../../mymodules/FriendsTabProcessing";
import { KeyboardAvoidingView } from "react-native";
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5
    },
    tabcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent:'space-between'
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
export default function SendRequest({masterData, sendingRequest}){
    //const [sendingRequest, setSendingRequest] = useState([])
    /*useEffect(() => {
      const q1 = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
        let request = []
        //console.log(request)
        querySnapshot.forEach((doc) => {
          request = doc.data().SendRequest
        })
        setSendingRequest(request)
        //console.log(sendingRequest)
        request = []
      })
    }, []);*/
    const ItemView = ({item}) => {
      return (
      <>
      {typeof sendingRequest !=='undefined' && sendingRequest.find(element => element === item.uid) ? (
      <Swipeable>
      <View style={styles.tabcontainer}> 
      <View style={{flexDirection: 'row', alignItems:'center'}}>
        <FriendsAvatar
          Img={!item.photo === "none" ? require('../../../PUT_Expo_Android/assets/user_no_avatar.jpg') : item.photoURL}
          Width={55}
          Height={55}
        />
        <View style={{marginLeft: 15, marginRight: 15}}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
            {item.displayName}
        </Text>
        <Text>
            {item.email}
        </Text>
        </View>
        </View>
        <View>
          <TouchableOpacity 
                style={[styles.button, styles.revokeRequest]}
                onPress={() => revokeRequest(item)}
          >
          <AntDesign name="deleteuser" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      </Swipeable>) : (<></>)
      }
      </>
      );
    };
      return (
        <KeyboardAvoidingView style={styles.container}>
          <FlatList
              data={masterData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 85, padding: 10}}
          >
          </FlatList>
        </KeyboardAvoidingView>
      )
  }