import React, { useContext, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, Dimensions} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "react-native-web";
import ConText from "../context/ConText"
import {signUp, signIn} from '../firebase'
import Splash from "./Splash";
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { auth } from '../firebase';
import { Modal } from "react-native";
import {FontAwesome, MaterialCommunityIcons, Fontisto, Ionicons, Entypo } from "@expo/vector-icons"
import { render } from "react-dom";

const styles = StyleSheet.create({
    txt_input: {
        color: 'black',
        margin: 5,
        paddingBottom: 10,
        height: 40,
        width: Dimensions.get('window').width * 0.80,
    },
    modalTitle: {
        alignItems: 'center',
        justifyContent: "center",
        padding: 15
    },
    txt_email: {
        borderBottomWidth: 0.5,
        borderColor: '#D1D1D1',
    },
    button1: {
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 2.5,
        width: 250
      },
      modalText: {
        textAlign: 'center',
        fontSize: 15,
        alignItems: 'center',
        justifyContent: "center",      
      },
      button: {
        padding: 15,
      },
      buttonClose: {
        borderTopWidth: 0.25,
        borderTopColor: "#d1d1d1",
        width: "100%",
        alignItems: 'center',
        justifyContent: "center",
      },
      textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
      },modalText: {
        textAlign: 'center',
        fontSize: 15,
        alignItems: 'center',
        justifyContent: "center",      
      },
      ModalIcon: {
        padding: 0,
        margin: 0
    },
});
export default function Forgot({navigation}) {
    const [email, setEmail] =  useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalStatus, setModalStatus] = useState(null);
    const {
        theme: {colors},
    } = useContext(ConText)

    function routingModal(){
        if (modalStatus === 1){
            setModalVisible(false);
            setTimeout(()=>{
                navigation.goBack('signIn');
            }, 1000)
            
        }
        else {
            setModalVisible(false);
        }
    }
    const resetPassword = () =>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(email) === true){
            sendPasswordResetEmail(
                auth, email)
                .then(function() {
                    setModalMessage('Vui lòng kiểm tra Email để khôi phục mật khẩu !');
                    setModalVisible(true);
                    setModalStatus(1);
                })
                .catch(function(error) {
                    setModalMessage('Email chưa được đăng ký');
                    setModalVisible(true);
                    setModalStatus(1);
           });   
        }   
        else {
            setModalMessage('Email không hợp lệ, vui lòng thử lại');
            setModalVisible(true);
            setModalStatus(2);
        }
    }  
        return (
            
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
                    <View>
                        <Pressable 
                            style={[styles.button1, styles.registerbtn]}  
                            onPress={resetPassword}
                            disabled={!email}>
                            <Text style={[styles.btntext, styles.logtext]}>
                                XÁC NHẬN
                            </Text>
                            
                        </Pressable>
                        <TouchableOpacity
                                style={{alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                onPress={() => {navigation.goBack("signIn")}}
                                >
                                <Text
                                    style={{textAlign: "center", marginTop: 10, color: "#42C2FF"}}
                                >
                                    Quay lại
                                </Text>
                            </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalTitle}>
                            <Text style={styles.modalText}>{modalMessage}</Text>
                        </View>
                        
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={routingModal}>
                        <Text style={styles.textStyle}>
                            &nbsp;&nbsp;OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
