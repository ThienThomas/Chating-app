import React, { useContext, useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, Pressable, Dimensions} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Keyboard } from "react-native";
import ConText from "../context/ConText"
import {signUp, signIn, auth} from '../firebase'
import Splash from "./Splash";
import { useNavigation } from "@react-navigation/native";
import { AppLoadingAnimation } from "../elements/AppLoadingAnimation";
import {GlobalContext, UseGlobalContext} from "../GlobalContext";
import { Alert } from "react-native";

const styles = StyleSheet.create({
    txt_input: {
        color: 'black',
        margin: 5,
        paddingBottom: 10,
        height: 40,
        width: Dimensions.get('window').width * 0.80,
    },
    txt_email: {
        borderBottomWidth: 0.5,
        borderColor: '#D1D1D1',
    },
    
    button: {
        borderRadius: 15,
        marginTop: 10,
        padding: 10,
        backgroundColor: 'red',
        width: Dimensions.get('window').width * 0.80,   
        margin: '1%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    registerbtn: {
        backgroundColor: "#FF5757"
    },
    loginbtn: {
        backgroundColor: "#42C2FF",
        color: "white"
    },
    btntext2: {
        marginTop: '5%',
        fontWeight: 'bold',
        color: '#42C2FF'
    },
    btntext: {
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    logtext: {
        color: 'white'
    },
    text_log: {
        color: "#42C2FF"
    },
    text_res: {
        color: "#FF5757"
    }
});
export default function SignIn() {
    return (
        <UseGlobalContext>
            <Form />
        </UseGlobalContext>
    )
}
function Form() {
    const [email, setEmail] =  useState("")
    const [password, setPassword] = useState("")
    const [passwordagain, setPasswordagain] = useState("")
    const [mode, setMode] = useState("signIn")

    const {
        theme: {colors},
    } = useContext(ConText)

    const navigation = useNavigation();
    const globalContext = useContext(GlobalContext);
    async function handlePress(){
        Keyboard.dismiss()
        globalContext.setIsPending(true)
        if (mode === "signUp"){
           await signUp(email, password, passwordagain)
        }
        if (mode === "signIn"){
            await signIn(email, password)
            if (!auth.currentUser){
                Alert.alert('Có lỗi xảy ra', 'Bạn vui lòng kiểm tra lại mật khẩu hoặc kết nối mạng và thử lại !', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ]);
            }
        }
        globalContext.setIsPending(false)
        
    }
    
    return (
        <>
        <View style={{
            justifyContent: "center", 
            alignItems: "center", 
            flex: 1, 
            backgroundColor: 'white'}
            }>
            <Image 
            source={require('../assets/welcome-img.png')}
            style={{width: Dimensions.get('window').width * 0.55, height: Dimensions.get('window').width * 0.55}}
            resizeMethod="auto"
             />
             <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Email'
                    placeholderTextColor="#D1d1d1"
                    style={[styles.txt_input, styles.txt_email]
                    }
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Mật khẩu'
                    placeholderTextColor="#D1d1d1"
                    secureTextEntry={true}
                    style={mode === "signIn" ? styles.txt_input : [styles.txt_input, styles.txt_email]}
                    
                />
                <TextInput
                    value={passwordagain}
                    onChangeText={setPasswordagain}
                    placeholder='Xác nhận mật khẩu'
                    placeholderTextColor="#D1d1d1"
                    secureTextEntry={true}
                    style={mode === "signIn" ? {display: 'none'} : styles.txt_input}
                    
                />
                <View>
                    <Pressable 
                        style={mode === 'signIn' ?  [styles.button, styles.loginbtn] :  [styles.button, styles.registerbtn]}  
                        onPress={handlePress} 
                        disabled={mode === 'signIn' ? (!email || !password) : (!email || !password || !passwordagain)}>
                        <Text style={[styles.btntext, styles.logtext]}>
                            {mode === "signIn" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
                        </Text>
                        
                    </Pressable>
                        <TouchableOpacity
                            style={{alignItems: "center",
                                    justifyContent: "center"
                            }}
                             onPress={
                                 () => mode === "signUp" ? setMode("signIn") : setMode("signUp")}
                            >
                            <Text
                                style={{textAlign: "center", marginTop: 10, color: "#42C2FF"}}
                            >
                                {
                                    mode === "signUp" ? 
                                    "Đã có tài khoản ? Đăng nhập !" :  "Chưa có tài khoản ? Đăng ký"
                                }
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{alignItems: "center",
                                    justifyContent: "center"
                                }}
                             onPress={() => {navigation.navigate("forgot")}}
                            >
                            <Text
                                style={{textAlign: "center", marginTop: 10, color: "#42C2FF"}}
                            >
                                Quên mật khẩu
                            </Text>
                        </TouchableOpacity>
                </View>
             </View>
        </View>
        {!globalContext.isPending ?  null : <AppLoadingAnimation />}
        </>
    )
}
