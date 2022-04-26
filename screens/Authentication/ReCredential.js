import React, { createRef, useEffect, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import { auth } from "../../firebase";
import { async } from "@firebase/util";
import { useNavigation } from "@react-navigation/native";

export default function ReCredential(){
    const input = React.createRef();
    const [countFail, setCountFail] = useState(3)
    const [password, setPassword] = useState('') 
    const navigation = useNavigation()
    useEffect(() => {
        input.current.focus()
    })
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <Text style={{textAlign: 'center'}}>Nhập lại mật khẩu để tiếp tục</Text>
            <TextInput
                onChangeText={(text) => setPassword(text)}
                ref={input}
                placeholder="Mật khẩu"
                style={{
                    marginLeft: 15,
                    marginRight: 15,
                    borderRadius: 20,
                    padding: 10,
                    marginTop: 10,
                    borderBottomColor: '#eeeeee',
                    borderBottomWidth: 1

                }}
                secureTextEntry={true}
            >
            </TextInput>
            <TouchableOpacity disabled={!password} onPress={async () => {
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    password
                )
                const result = await reauthenticateWithCredential(
                    auth.currentUser,
                    credential
                ).then(() => {
                    navigation.replace('account')
                }).catch((error) => {
                    if (countFail > 0) {
                    let counted = countFail;
                    counted--;
                    Alert.alert('Có lỗi xảy ra', `Bạn vui lòng kiểm tra lại mật khẩu và thử lại ! \n Còn ${counted} lần thử`, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                      ]);
                      setCountFail(counted)

                    }
                    
                    else {
                        auth.signOut().then(()=>{
                            //globalContext.setIsPending(false)
                            navigation.replace('signIn');
                        })
                    }
                })
            }} style={{backgroundColor: "#42C2FF", margin: 15, borderRadius: 15}}>
                <Text style={{color: 'white', padding: 15, textAlign: 'center', fontWeight: 'bold'}}>TIẾP TỤC</Text>
            </TouchableOpacity>
        </View>
    )
}