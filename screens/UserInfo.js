import { Header } from "@react-navigation/stack";
import React, {useState} from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather,Entypo, MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Dialog from "react-native-dialog";



const styles = StyleSheet.create({
    name: {
        fontSize: 20,
        marginBottom: 100,
        marginTop: 25
    },
    button: {
        borderRadius: 15,
        marginTop: 10,
        padding: 10,
        backgroundColor: 'red',
        width: Dimensions.get('window').width * 0.5,   
        margin: '1%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    editbtn: {
        backgroundColor: "#42C2FF",
        color: "white"
    },
    logoutbtn: {
        backgroundColor: "#FF5757",
        color: "white"
    },
    btntext: {
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
    lineargradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
    },
    img: {
        position: 'absolute',
        zIndex: 5,
        top:  Dimensions.get('window').height * 0.065,
        height: Dimensions.get('window').height * 0.2,
        width: Dimensions.get('window').height * 0.2, 
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 4, 
    },
    viewcontent: {
        position: 'absolute', 
        top:  Dimensions.get('window').height * 0.175,  
        backgroundColor: 'white', 
        width: '100%', 
        height:  Dimensions.get('window').height,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,

    },
    textlogout:{color: 'black', 
    fontSize: 18, 
    fontWeight: 'bold',
    color: "#FF7474",
    top: Dimensions.get('window').height * 0.45
    }, 
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})

export default function UserInfo(){
    const navigation = useNavigation();
    const user = auth.currentUser;
    const img_URL = user.photoURL;
    
    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
            <LinearGradient 
                    start={{x: 0, y: 0}}
                    end={{x:0.25, y:0.295}}
                    colors={["#2800FF", "#08F19D"]}
                    style={styles.lineargradient}
                />
            <View>
                <View style={{marginTop: 35, marginLeft: 5}}>
                    <View style={{flexDirection:'row', flexWrap:'wrap', width: Dimensions.get('window').width}}>
                        <View style={{width: Dimensions.get('window').width * 0.875}}>
                        <TouchableOpacity  onPress={() => {navigation.goBack()}}>
                                <Feather name="chevron-left" size={35} color="white" />
                        </TouchableOpacity>
                        </View>
                        <View style={{marginTop: 5}}>
                        <TouchableOpacity  onPress={() => {navigation.navigate('changeinfo')}}>
                                <Feather name="settings" size={25} color="white" />
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                    <Image
                        source={!img_URL ? require('../assets/user_no_avatar.jpg') : {uri: img_URL, cache: 'only-if-cached'}}
                        style={styles.img}
                    >
                    </Image>
                <View style={styles.viewcontent}>
                    <View
                        style={{
                            marginTop: Dimensions.get('window').height * 0.11,

                        }}>
                        <Text style={{ 
                            textAlign: 'center', 
                            fontSize: 24, 
                            fontWeight: 'bold'}}>
                            {user.displayName}
                        </Text>
                        <TouchableOpacity 
                            style={{height: 50}}
                            
                        >
                        { user.bio === undefined ? (
                            <View
                                style={{justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 15,
                                    flexDirection:'row', 
                                    flexWrap:'wrap'}}>
                            <MaterialCommunityIcons name="grease-pencil" size={24} color="#1590C4" />
                                <Text
                                    style={{
                                    fontSize: 15,
                                    color: '#1590C4',
                                    paddingLeft: 5 }}>
                                     Thêm thông tin giới thiệu
                            </Text>    
                        </View>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: 'black',
                                    paddingLeft: 5 
                                    }}>
                                    {user.bio}
                             </Text> 
                        )
                       }
                       </TouchableOpacity>
                       <Pressable style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.textlogout}>
                                <MaterialCommunityIcons name="logout" size={18} color="#FF7474" fontWeight="bold"/>&nbsp;Đăng xuất
                            </Text> 
                        </Pressable>
                    </View>
                </View>
                </View>
            </View>

        </View>
    )
}
