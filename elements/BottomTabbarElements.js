import React from "react";
import { View, Text } from "react-native";
import { Feather } from '@expo/vector-icons';
export default function BottomTabNavigatorElement({name, focused, text}){
    return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Feather name={name} size={30} color={focused ? "#1590C4" : "#d1d1d1"}></Feather>
        <Text style={focused ? {color: "#1590C4"} : {color: "#d1d1d1"}}>{text}</Text>
    </View>
    )
}
