import React, { useContext } from "react";
import { View,Text, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { urlAlphabet } from "nanoid";
import  ImageViewer from 'react-native-image-zoom-viewer';
import { GlobalContext, UseGlobalContext } from "../GlobalContext";
export default function Avatar({Width, Height}){
  return (
    <UseGlobalContext>
      <MyAvatar w={Width} h={Height}></MyAvatar>
    </UseGlobalContext>
  )
}
function MyAvatar({w, h}) {
    const navigation = useNavigation();
    const globalContext = useContext(GlobalContext)
    return (
        auth.currentUser ? (
          <View>
          <Image
              source={!globalContext.userInfo.photoURL ? require('../assets/user_no_avatar.jpg') : {uri: globalContext.userInfo.photoURL, cache: 'force-cache'}}
                  style={{width: !w ? 45 : w, 
                  height: !h ? 45 : h,
                  borderRadius: 200
                  }}
                  resizeMethod="auto">
          </Image>
        </View>
        ) : (<></>)
    )
}
export function Name({fontS}){
  return (
    <UseGlobalContext>
      <MyName fonts={fontS}/>
    </UseGlobalContext>
  )
}
function MyName({fonts}){
  const globalContext = useContext(GlobalContext)
  return (
    auth.currentUser ? (
      <Text style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 24,marginTop: 15, marginBottom: 15, fontWeight: 'bold'}}>{globalContext.userInfo.displayName}</Text>
    ) : (<></>)
  )
}