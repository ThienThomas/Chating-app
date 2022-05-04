import React, { useEffect, useState, useContext  } from "react";
import { View, Text, StatusBar, Dimensions, Pressable, Image, Modal, StyleSheet, PermissionsAndroid, Alert} from "react-native";
import { Constants } from "expo-constants";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import {FontAwesome, MaterialCommunityIcons, Fontisto, Ionicons, Entypo } from "@expo/vector-icons"
import { setSelectedLog } from "react-native/Libraries/LogBox/Data/LogBoxData";
import * as ImagePicker from 'expo-image-picker'
import { app, auth, db, storage} from "../../firebase";
import { uploadImage } from "../../utils";
import { updateProfile } from "firebase/auth";
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytes} from "firebase/storage";
import { cacheImages, _loadAssetsAsync } from "../../AssetsCaching";
import { getDatabase, ref,  onValue, set } from "firebase/database";
import { async } from "@firebase/util";
import { AppLoadingAnimation } from "../../elements/AppLoadingAnimation";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext, UseGlobalContext } from "../../GlobalContext";
import { nanoid } from "nanoid";
const styles = StyleSheet.create({
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
      fontWeight: 'normal',
      textAlign: 'center',
    },
    modalText: {
      textAlign: 'center',
      fontWeight: "bold",
      fontSize: 15,
      alignItems: 'center',
      justifyContent: "center",      
    },
    imagepicker_text: {
        color: "black"
    },
    imagepicker: {
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
    },
    modalTitle: {
        alignItems: 'center',
        justifyContent: "center",
        padding: 15
    },
    ModalIcon: {
        padding: 0,
        margin: 0
    },
    yourname: {
        borderBottomWidth: 0.75,
        borderBottomColor: '#d1d1d1',
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
        fontSize: 16
    },
    nextbtn: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 100,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#42C2FF"
    },
    avatarselect: {
        marginTop: 30, 
        borderRadius: 150, 
        width: 150,
        height: 150,
        borderColor: "#42C2FF",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    }
  });
export default function CreateGroupInfo({route}) {
    const users = route.params.users
    console.log("=>", users)
    return (
        <UseGlobalContext>
            <GroupInfo users={users} />
        </UseGlobalContext>
    )
}
function GroupInfo({users}){
    const [displayName, setDisplayName] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const globalContext = useContext(GlobalContext)
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const navigation = useNavigation()
    async function requestCameraPermission(){
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
            );
          } catch (err) {
        }
        setHasCameraPermission('granted');
        setHasGalleryPermission('granted');
    }
    async function Picker(){
        if (hasCameraPermission !== 'granted' || hasGalleryPermission !== 'granted'){
            requestCameraPermission();
            setModalVisible(true);
        }
        else setModalVisible(true);
    }
    async function handleProfilePicture(val){
        if (hasCameraPermission === 'granted' || hasGalleryPermission === 'granted'){
            if (val === 1){
                const result = await ImagePicker.launchCameraAsync();
                if (!result.cancelled){
                    setSelectedImage(result.uri)
                    setModalVisible(false);
                }
            }
            else if (val === 2){
                const result = await ImagePicker.launchImageLibraryAsync();
                if (!result.cancelled){
                    setSelectedImage(result.uri)
                    setModalVisible(false);
                } 
            }
        }
        else requestCameraPermission();
    }
    async function CreateGroupInformation(){
        const groupId = nanoid();
        //let PromiseArray = [];
        const Users = users
        Users.push(auth.currentUser.uid)
        let url1 = "none"
        let fileName1 = ""
        if (selectedImage){
            const {url, fileName} = await uploadImage(selectedImage,  `chatgroups/${groupId}/avatar/`, "groupavatar")
            url1 = url;
            fileName1 = fileName;
        }
        await Promise.all(users.map(async (child) => {
            //console.log("===>", child)
            updateDoc(doc(db, "users", child), {
                groupchats: arrayUnion(groupId)
            })
        }))
        const message = {
            _id: nanoid(),
            text: 'Các bạn đang kết nối trên Exping',
            system: true,
            createdAt: new Date(),
            
        }
        setDoc(doc(db, 'chatgroups', groupId),{
            draf: [],
            lastmessage: {
              ...message
            },
            //users: item.uid > auth.currentUser.uid ? [auth.currentUser.uid, item.uid] : [item.uid, auth.currentUser.uid],
            participants: Users,
            avatar: url1,
            name: displayName,
          })
        const colRef = collection(doc(db, 'chatgroups', groupId), "messages");
        addDoc(colRef, {
            ...message
        })
        const colRef2 = collection(doc(db, 'chatgroups', groupId), "videocall");
        addDoc(colRef2, {
            Initvideo: []
          })
        //console.log(selectedImage.uri)
        
        const colRef3 = collection(doc(db, 'chatgroups', groupId), "groupinfo"); 
        addDoc(colRef3, {
            avatar: url1,
            name: displayName,
            participants: users,
            admin: auth.currentUser.uid
        })
        Alert.alert('Thành công !', 'Tạo nhóm thành công!', [
            { text: 'OK', onPress: () => navigation.navigate('home') },
        ]);
    }
    return (
        <>
        <React.Fragment>
            <StatusBar style="auto" />
            <View style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1, 
                padding: 20
            }}>
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
                <Text style={styles.modalText}>Thêm hình ảnh</Text>
                </View>
                <Pressable
                    onPress={() => handleProfilePicture(1)}
                    disabled={!modalVisible}
                    style={[styles.button, styles.buttonClose]}>
                <Text style={styles.textStyle}>
                    <FontAwesome name="camera" size={15} color="black" style={styles.ModalIcon}/>
                    &nbsp;&nbsp;Máy ảnh
                </Text>
                </Pressable>
                <Pressable
                    onPress={() => handleProfilePicture(2)}
                    disabled={!modalVisible}
                    style={[styles.button, styles.buttonClose]}>
                <Text style={styles.textStyle}>
                <FontAwesome name="image" size={15} color="black" style={styles.ModalIcon} />
                 &nbsp;&nbsp;Thư viện
                </Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>
                    <FontAwesome name="close" size={15} color="black" />
                    &nbsp;&nbsp;Hủy</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
            <Text style={{fontSize: 24, color: "#42C2FF", fontWeight: 'bold'}}>
                Một bước nữa !
            </Text>
            <Text style={{fontSize: 15, color: "black", marginTop: 10}}>
                Thêm tên và hình đại diện cho nhóm nhé !
            </Text>
            <TouchableOpacity 
                onPress={() => Picker()}
                style={styles.avatarselect}>
                {!selectedImage ? 
                    (<MaterialCommunityIcons name="camera-plus" size={50} color="#42C2FF"  />) : 
                    <Image 
                        source={{uri: selectedImage}}
                        style={{width: "100%", height: "100%", borderRadius: 120}}
                    />}
            </TouchableOpacity>
            <TextInput
                placeholder="Tên nhóm"
                placeholderTextColor={"#d1d1d1"}
                value={displayName}
                onChangeText={setDisplayName}
                style={
                    styles.yourname
                }>
            </TextInput>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 150
                 }}>
                <Pressable  
                    onPress={() => {
                        CreateGroupInformation()
                        /*Alert.alert('Thành công !', 'Tạo nhóm thành công!', [
                            { text: 'OK', onPress: () => navigation.navigate('home') },
                        ]);*/
                    }}
                    disabled={!displayName}
                    style={styles.nextbtn}>  
                    <Text 
                        style={{
                            fontWeight: "bold",
                            color: "white"
                        }}
                    >Tiếp tục</Text>
                </Pressable>
                </View>
            </View>
        </React.Fragment>
        {!globalContext.isPending ?  null : <AppLoadingAnimation />}
        </>
    )
}