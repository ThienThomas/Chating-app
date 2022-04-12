import { Header } from "@react-navigation/stack";
import React, {useState} from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather,Entypo, MaterialCommunityIcons, FontAwesome, MaterialIcons} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Avatar, { Name } from "../elements/Avatar";
const styles = StyleSheet.create({
    viewcontent: {
        backgroundColor: 'white', 
    },

})
function MiniComponent({label, iconanme, color, size}){
    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection:'row', 
                flexWrap:'wrap',
                marginTop: 20}}>
            <MaterialIcons 
                name={iconanme}
                size={!size ? 24 : size} 
                color="white"
                style={{
                    padding: 8,
                    borderRadius: 100,
                     justifyContent: 'center',
                     alignItems: 'center',
                     width: 40,
                     height: 40,
                     backgroundColor: color
                }} 
                />
            <Text
                style={{
                fontSize: 18,
                color: 'black',
                paddingLeft: 5}}>
                &nbsp;&nbsp;{label}
            </Text>    
        </View>
    )
}
export default function Settings(){
    const navigation = useNavigation();
    const user = auth.currentUser;

    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Avatar Width={100} Height={100}/>
            <Name fontS={24}></Name>
          </View>
          <View style={{flex: 1, marginLeft: 20}}>
              <TouchableOpacity>
                <MiniComponent iconanme="email" label="Email" color="green"/>
              </TouchableOpacity>
              <TouchableOpacity>
                <MiniComponent iconanme="lock" label="Mật khẩu" color="#1590C4"/>
              </TouchableOpacity>
              <TouchableOpacity>
                <MiniComponent iconanme="notifications" label="Thông báo" color="#FF7474"/>
              </TouchableOpacity>
              <TouchableOpacity >
                <MiniComponent iconanme="messenger" label="Tin nhắn" color="orange"/>
              </TouchableOpacity >
              <TouchableOpacity >
                <MiniComponent iconanme="call" label="Cuộc gọi" color="purple"/>
              </TouchableOpacity >
          </View>
        </View>
    )
}
