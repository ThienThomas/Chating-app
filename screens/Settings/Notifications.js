import React, { useContext } from "react";
import { View, Text } from "react-native";
import { GlobalContext, UseGlobalContext } from "../../GlobalContext";
import { TouchableOpacity } from "react-native";
import { MiniComponent } from "./Settings";
import { CheckBox, Switch } from "react-native-elements";
export default function Notifications(){
    return (
        <UseGlobalContext>
            <MyNotifSettings></MyNotifSettings>
        </UseGlobalContext>
    )
}
function MyNotifSettings() {
    const globalContext = useContext(GlobalContext)
    return (
        <View style={{flex: 1, backgroundColor:'white', paddingLeft: 20, paddingRight: 20 }}>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between'}}>
                <Text style={{fontSize: 18}}>{globalContext.notifications ? "Đang bật" : "Đã tắt"}</Text>
                <Switch 
                    style={{
                        alignSelf:'flex-end',
                    }}
                    thumbColor={globalContext.notifications ? "white" : "black"}
                    value={globalContext.notifications}
                    onChange={() => globalContext.setNotifications(!globalContext.notifications)}
                ></Switch>
            </View>
            <View>
                <Text>{globalContext.notifications ? "" : ("Cho đến 1:30 ngày mai")}</Text>
            </View>
        </View>
    )
}