import React from "react";
import { View,Text, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { urlAlphabet } from "nanoid";
import  ImageViewer from 'react-native-image-zoom-viewer';
export default function Avatar({Width, Height}) {
    const navigation = useNavigation();
    return (
      
        auth.currentUser ? (
          <View>
          <Image
              source={!auth.currentUser.photoURL ? require('../assets/user_no_avatar.jpg') : {uri: auth.currentUser.photoURL, cache: 'force-cache'}}
                  style={{width: !Width ? 45 : Width, 
                  height: !Height ? 45 : Height,
                  borderRadius: 200
                  }}
                  resizeMethod="auto">
          </Image>
        </View>
        ) : (<></>)
      
    )
}
export function Name({fontS}){
  return <Text style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 24,marginTop: 15, marginBottom: 15, fontWeight: 'bold'}}>{auth.currentUser.displayName}</Text>
}