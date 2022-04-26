import { Header } from "@react-navigation/stack";
import React, {useContext, useState} from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather,Entypo, MaterialCommunityIcons, FontAwesome, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../firebase";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Avatar, { Name } from "../../elements/Avatar";
import { GlobalContext, UseGlobalContext } from "../../GlobalContext";
const styles = StyleSheet.create({
    viewcontent: {
        backgroundColor: 'white', 
    },

})
export function MiniComponent({label, iconanme, color, size}){
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
    return (
        <UseGlobalContext>
            <Setting></Setting>
        </UseGlobalContext>
    )
}
function Setting(){
    const globalContext = useContext(GlobalContext)
    const navigation = useNavigation();
    const user = auth.currentUser;
    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Avatar Width={100} Height={100}/>
            <Name fontS={24}></Name>
          </View>
          <View style={{flex: 1, marginLeft: 20}}>
              <TouchableOpacity onPress={() => {navigation.navigate('recredential')}}>
                <MiniComponent iconanme="supervisor-account" label="Tài khoản" color="green"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation.navigate('notif')}}>
                <MiniComponent iconanme="notifications" label="Thông báo" color="#FF7474"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation.navigate('darkmode')}} >
                <MiniComponent iconanme="wb-sunny" label="Chế độ tối" color="black"/>
              </TouchableOpacity >
          </View>
        </View>
    )
}
