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
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytes} from "firebase/storage";
import { cacheImages, _loadAssetsAsync } from "../../AssetsCaching";
import { getDatabase, ref,  onValue, set } from "firebase/database";
import { async } from "@firebase/util";
import { AppLoadingAnimation } from "../../elements/AppLoadingAnimation";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext, UseGlobalContext } from "../../GlobalContext";
export default function Profile(){
    return (
        <UseGlobalContext>
            <MyProfile />
        </UseGlobalContext>
    )
}
function MyProfile(){
    const [displayName, setDisplayName] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const navigation = useNavigation();
    const globalContext = useContext(GlobalContext);
    async function requestCameraPermission(){
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.CAMERA,
                     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
            );
          } catch (err) {
            console.warn(err);
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
    async function uploadDatabase(Uid, Name, Email, PhotoURL){
        const rdb = getDatabase();
        const reference = ref(rdb, "users/" + Uid)
        set(reference, {
            uid: Uid,
            name: Name,
            email: Email,
            photo: !PhotoURL ? "none" : PhotoURL,
            
        }).catch((error) => {
            alert("Có lỗi xảy ra, vui lòng thử lại")
        })
    }
    async function handlePress() {
        globalContext.setIsPending(true);
        const user = auth.currentUser;
        let photoURL;
        if (selectedImage) {
          const { url } = await uploadImage(
            selectedImage,
            `avatars/${user.email}`,
            "profilePicture"
          );
          photoURL = [url];
          _loadAssetsAsync(photoURL);

        }
        const userData = {
          displayName,
          email: user.email,
        };
        if (photoURL) {
          userData.photoURL = photoURL[0];
        }
        
        await Promise.all([
          updateProfile(user, userData),
          setDoc(doc(db, "users", user.uid), { ...userData,
            uid: user.uid, 
            listfriends: [],
            listchats:[],
            SendRequest: [],
            receivedRequest: [],
            spams: [],
            blocks: [],
            bio: ""
            }),
        ]);
        globalContext.setIsPending(false);
        navigation.replace('home')
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
                Thêm tên và hình đại diện của bạn nhé !
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
                placeholder="Tên của bạn"
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
                    onPress={handlePress}
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
