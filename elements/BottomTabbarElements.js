import React from "react";
import { View, Text } from "react-native";
import { Feather } from '@expo/vector-icons';
export default function BottomTabNavigatorElement({name, focused, text}){
    return (
    <View style={{alignItems: 'center', justifyContent: 'center', width: 100}}>
        <Feather name={name} size={30} color={focused ? "#42C2FF" : "#d1d1d1"}></Feather>
        <Text style={focused ? {color: "#42C2FF", fontSize: 15, fontWeight: 'bold'} : {color: "#d1d1d1", fontSize: 15}}>{text}</Text>
    </View>
    )
}
