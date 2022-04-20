import React, { useEffect, useState } from "react";
import { View ,Text, StyleSheet, Dimensions, ImageBackground, Image} from "react-native";
import { LinearGradient } from "react-native-svg";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, FontAwesome, Entypo, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
const styles = StyleSheet.create({
    lineargradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
    },
    icon: {
        margin: 7.5,
    },
    icon_opa: {
        borderRadius: 100,
        padding: 15,
    },
    speaker: {
        backgroundColor: "#d1d1d1",
        
    },
    close: {
        backgroundColor: "#FF5757",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    }
})
export default function VideoChat({route}) {
    const user = route.params.user
    const [response, setResponse] = useState(false)
    const [clock, setClock] = useState(0)
    const [camera, setCamera] = useState(true)
    const [speaker, setSpeaker] = useState(true)
    const [micro, setMicro] = useState(true)

    const navigation = useNavigation()
    
    useEffect(() =>{
        setTimeout(()=> {setResponse(true)}, 5000)
    }, [])
    return (
        <>
        <StatusBar style='transparent' /> 
        <View  style={{flex: 1, backgroundColor: "white", justifyContent:'center', alignItems: 'center',}}>
            {!response ? (<>
                    <FriendsAvatar Img={!user.photoURL === "none" ? require('../../assets/user_no_avatar.jpg') : user.photoURL}
                    Width={150}
                    Height={150}
                    ></FriendsAvatar>
                    <Text style={{fontWeight: 'bold', fontSize: 35, marginTop: 25}}>{user.displayName}</Text>
                    <Text style={{ marginTop: 10}}>Đang gọi...</Text>
                </>) : 
                (<>
                    <ImageBackground  source={! user.photoURL ? require('../../assets/user_no_avatar.jpg') : {uri: user.photoURL, cache: 'force-cache'}} style={{width: "100%", height: "100%"}} >
                        <Image source={!auth.currentUser.photoURL ? require('../../assets/user_no_avatar.jpg') : {uri: auth.currentUser.photoURL, cache: 'force-cache'}} style={{borderRadius: 10, width: "30%", height: "30%", top: 100, left: Dimensions.get('window').width * 0.6}} />
                    </ImageBackground>
                    
                </>)}
        </View>
        <View style={{flexDirection: 'row', bottom: Dimensions.get('window').height * 0.0, backgroundColor: 'white', justifyContent: 'center', alignContent: 'center', paddingBottom: 10, paddingTop: 10}} >
                <TouchableOpacity style={styles.icon}  onPress={() => {setCamera(!camera)}}>
                    <Feather name={camera ? "camera" : "camera-off"} size={35} color="white"  style={!camera ? [{backgroundColor: "grey"},  styles.icon_opa] : [styles.speaker, styles.icon_opa]  }/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon}  onPress={() => {setSpeaker(!speaker)}}>
                    <AntDesign name="sound" size={35} color="white"  style={!speaker ? [{backgroundColor: "grey"},  styles.icon_opa] : [styles.speaker, styles.icon_opa]  }/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon} onPress={() => {setMicro(!micro)}}>
                    <Feather name={micro ? "mic" : "mic-off"} size={35} color="white"  style={!micro ? [{backgroundColor: "grey"},  styles.icon_opa] : [styles.speaker, styles.icon_opa]  }/>
                </TouchableOpacity >
                <TouchableOpacity style={styles.icon} onPress={() => {navigation.goBack()}}>
                    <AntDesign name="close" size={35} color="white"  style={[styles.close, styles.icon_opa]} />
                </TouchableOpacity>
            </View>
        </>
    )
}