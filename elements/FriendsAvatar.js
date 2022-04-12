import React from "react";
import { View,Text, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
export default function FriendsAvatar({Width, Height, Img}) {
    const navigation = useNavigation();
    return (
          <View>
          <Image
              source={
                  !Img ? require('../assets/user_no_avatar.jpg') : {uri: Img, cache: 'force-cache'}}
                  style={{width: !Width ? 45 : Width, 
                  height: !Height ? 45 : Height,
                  borderRadius: 200
                  }}
                  resizeMethod="auto">
          </Image>
        </View>
    )
}