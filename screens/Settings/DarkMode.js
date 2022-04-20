import React from "react";
import { View, Text } from "react-native";
import { CheckBox } from "react-native-elements";
export default function DarkMode(){
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <CheckBox/><Text style={{fontSize: 18}}>Tắt</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <CheckBox/><Text style={{fontSize: 18}}>Bật</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
            <CheckBox/><Text style={{fontSize: 18}}>Hệ thống</Text>
            </View>
        </View>
    )
}