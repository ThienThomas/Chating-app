import React, { useState } from "react";
import { View, Text, StatusBar, Dimensions } from "react-native";
import { Constants } from "expo-constants";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import {MaterialCommunityIcons} from "@expo/vector-icons"
export default function Profile(){
    const [displayName, setDisplayName] = useState("")
    const [selectedImage, setselectedImage] = useState(null)
    return (
        <React.Fragment>
            <StatusBar style="auto" />
            <View style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1, 
                padding: 20
            }}>
            <Text style={{fontSize: 24, color: "#42C2FF", fontWeight: 'bold'}}>
                Một bước nữa !
            </Text>
            <Text style={{fontSize: 15, color: "black", marginTop: 10}}>
                Thêm tên và hình đại diện của bạn nhé !
            </Text>
            <TouchableOpacity 
                style={{marginTop: 30, 
                        borderRadius: 130, 
                        width: 130,
                        height: 130,
                        backgroundColor: "#42C2FF",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.3
                }}
            >
                {!selectedImage ? 
                    (<MaterialCommunityIcons 
                        name="camera-plus" 
                        color={"black"} 
                        size={60}
                        opacity={1}
                        />) : 
                    <Image 
                        source={{uri: selectedImage}}
                        style={{width: "100%", height: "100%", borderRadius: 120}}
                    />}
            </TouchableOpacity>
            <TextInput
                placeholder="Tên của bạn"
                placeholderTextColor={"#d1d1d1"}
                value={displayName}
                onChangeText={setDisplayName}
                style={{
                    borderWidth: 1,
                    borderColor: '#d1d1d1',
                    color: 'black',
                    marginTop: 30,
                    height: 40,
                    width: Dimensions.get('window').width * 0.75,
                    textAlign: "center",
                    alignItems: "center", 
                    justifyContent: "center",
                    borderRadius: 30,
                    height: Dimensions.get('window').width * 0.15,
                    textDecorationLine: "none",
                    fontWeight: "bold",
                    fontSize: 18
                }}
                >
            </TextInput>
            </View>
        </React.Fragment>
    )
}