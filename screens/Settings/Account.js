import React, { useContext, useEffect, useState }  from "react";
import { View, Text, TouchableOpacity, Alert} from "react-native";
import { GlobalContext, UseGlobalContext } from "../../GlobalContext";
import { MaterialIcons } from '@expo/vector-icons'; 
import { MiniComponent } from "./Settings";
import { useNavigation } from "@react-navigation/native";
export default function Account() {
    return (
        <UseGlobalContext>
            <MyAccount />
        </UseGlobalContext>
    )
}
function MyAccount() {
    const globalContext = useContext(GlobalContext)
    const navigation = useNavigation()
    return (
        <View style={{flex: 1, backgroundColor:'white', paddingLeft: 20}}>
            <TouchableOpacity onPress={() => {navigation.navigate('changeEmail')}}>
                <MiniComponent iconanme="email" label="Email" color="green"/>
            </TouchableOpacity>
            <TouchableOpacity>
                <MiniComponent iconanme="drive-file-rename-outline" label="Tên hiển thị" color="orange"/>
            </TouchableOpacity>
            <TouchableOpacity>
                <MiniComponent iconanme="lock" label="Mật khẩu" color="#1590C4"/>
            </TouchableOpacity>            
        </View>
    )
}
