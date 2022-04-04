import React from "react";
import { View,Text, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { urlAlphabet } from "nanoid";
export default function Avatar() {
    const navigation = useNavigation();
    const user = auth.currentUser;
    return (
        <View style={{marginLeft: 15}}>
                <TouchableOpacity onPress={() => {navigation.navigate('userinfo')}} >
                  <Image
                    source={!user.photoURL ? require('../assets/user_no_avatar.jpg') : {uri: user.photoURL, cache: 'only-if-cached'}}

                    style={{width: 45, 
                            height: 45,
                            borderRadius: 50}}
                    resizeMethod="auto"
                  >
                </Image>
                </TouchableOpacity>
        </View>
    )
}