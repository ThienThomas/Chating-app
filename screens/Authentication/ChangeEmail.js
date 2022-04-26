import React from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { auth } from "../../firebase";

export default function ChangeEmail(){
    return (
        <View style={{flex: 1, backgroundColor: 'white', paddingLeft: 15, paddingRight: 15}}>
            <TextInput>

            </TextInput>
        </View>
    )
}