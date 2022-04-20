import { async } from "@firebase/util";
import { collection, doc, query, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState }  from "react";
import { View, Text, TouchableOpacity, Alert} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { db } from "../../firebase";
export default function ChangeBio({route, navigation}){
    const input = React.createRef();
    const [bio, setBio] = useState(route.params.mybio)
    const uid = route.params.myuid
    useEffect(() => {
       input.current.focus()
    }, [])
    const updateMyBio = async () => {
        const refDoc = doc(db, "users", uid)
        const res = await updateDoc(refDoc, {bio: bio}).then(
            Alert.alert('Thành công', 'Cập nhật thành công !', [
                { text: 'OK', onPress: ()  => navigation.goBack() },
              ])
            ).catch(() => {
            Alert.alert('Có lỗi xảy ra', 'Bạn vui lòng thử lại sau nhé !', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ]);
        })
    }
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <TextInput
                ref={input}
                value={bio}
                onChangeText={(text) => setBio(text)}
                multiline={true}
                numberOfLines={5}
                placeholder="Thêm giới thiệu bản thân"
                style={{
                    marginLeft: 15,
                    marginRight: 15,
                    backgroundColor: "#eeeeee",
                    borderRadius: 20,
                    padding: 10,
                    textAlignVertical: 'top'
                }}
            >
            </TextInput>
            <View style={{flexDirection:'row', justifyContent:'center', marginTop: 10}}>
                <TouchableOpacity 
                    style={{
                        width: '42%',
                        backgroundColor: "#42C2FF", 
                        margin: '2%', 
                        padding: 10, 
                        borderRadius: 20
                    }} 
                    disabled = { bio === route.params.mybio }
                    onPress = {updateMyBio}
                    >
                    <Text style={{textAlign: 'center' ,fontSize: 16, fontWeight: 'bold', color:'white'}}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{
                        width: '42%',
                        backgroundColor: "#FF5757", 
                        margin: '2%', 
                        padding: 10, 
                        borderRadius: 20
                    }} 
                    disabled = {!bio} 
                    onPress={() => setBio('')}>
                    <Text style={{textAlign: 'center' ,fontSize: 16, fontWeight: 'bold', color:'white'}}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}