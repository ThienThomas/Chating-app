import { BackgroundImage } from "@rneui/base";
import React from "react";
import { View, Text, ImageBackground, Image, Dimensions} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Fontisto,AntDesign, FontAwesome } from '@expo/vector-icons';
import { uploadImage } from '../../../utils';
import { auth, db } from '../../../firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
export default function PickPhoto({route}) {
    const image = route.params.image
    const user = route.params.user
    const docid = route.params.docid
    const navigation = useNavigation()
    async function UploadMyImage(){
  
      const maniResult = await manipulateAsync(
        image.localUri || image.uri,
        [{resize: {width: image.width * 0.7, height: image.height * 0.7}}],
        {
          compress: 0.5, format: SaveFormat.JPEG
        }
      )
      console.log(maniResult)
    
      const {url, fileName} = await uploadImage(maniResult.uri,  `chatrooms/${docid}/images/`)
      const message = {
        _id : fileName,
        text: "",
        sentBy: auth.currentUser.uid,
        sendTo: user.uid,
        createdAt: new Date(),
        image: url,
        user : {
          _id: auth.currentUser.uid
        },
        type: "image"
      }
      setDoc(doc(db, 'chatrooms', docid), {
        draf: [],
        lastmessage: {
          ...message
        },
        participants: [user.uid, auth.currentUser.uid],
        seen: false
      })
      const docRef = doc(db, 'chatrooms', docid);
      const colRef = collection(docRef, "messages");
      let timeStamp = serverTimestamp()

      addDoc(colRef, {
        ...message,
        createdAt: timeStamp
      })
      const colRef2 = collection(docRef, "sharingimages");
      addDoc(colRef2, {
        url: message.image,
        createdAt: timeStamp
      })
      navigation.goBack()
    }
    return (
        <View style={{flex: 1, justifyContent: 'center',  backgroundColor: 'black'}}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <ImageBackground source={image} style={{width:  Dimensions.get('window').width,height: Dimensions.get('window').height,}} resizeMode='contain' >
                  <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginBottom: 20,
                    marginRight: 20,
                    marginLeft: 20,
                    justifyContent: 'flex-end',
                }}
                >
                <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                >
                    <View
                    style={{
                        borderRadius: 10,
                        backgroundColor: '#eeeeee',
                        padding: 10,
                        width: '60%'
                    }}
                    >   
                        <Text style={{color: 'black'}}>Gửi ảnh đến</Text>
                        <Text style={{color: 'black', fontSize: 18, opacity: 1, fontWeight: 'bold'}}>{user.displayName}</Text>
                    </View>
                    <TouchableOpacity
                   onPress={() => {UploadMyImage()}}
                    style={{
                        alignItems: 'center',
                        borderRadius: 50,
                        backgroundColor: 'white',
                        width: 60,
                        height: 60,
                        justifyContent: 'center',
                    }}
                    >
                    <FontAwesome name="send" size={25} color="#42C2FF" />
                    </TouchableOpacity>
                </View>
                  </View>
              </ImageBackground>
            </View>
        </View>
    )
}