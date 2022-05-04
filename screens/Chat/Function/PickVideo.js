import React from "react";
import { Video, AVPlaybackStatus  } from "expo-av";
import { View, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import {Fontisto,AntDesign, FontAwesome } from '@expo/vector-icons';
import { uploadImage, uploadVideo } from '../../../utils';
import { auth, db } from '../../../firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import vi from "dayjs/locale/vi";
export default function PickVideo({route}) {
    const video = route.params.video
    const user = route.params.user
    const docid = route.params.docid
    console.log(video)
    const VideoRef = React.useRef(null)
    const navigation = useNavigation()
    async function UploadMyVideo(){
  
        /*const maniResult = await manipulateAsync(
          image.localUri || image.uri,
          [{resize: {width: image.width * 0.7, height: image.height * 0.7}}],
          {
            compress: 0.5, format: SaveFormat.JPEG
          }
        )
        console.log(maniResult)
          */
        const {url, fileName} = await uploadVideo(video.uri,  `chatrooms/${docid}/videos/`)
        const message = {
          _id : fileName,
          text: "",
          sentBy: auth.currentUser.uid,
          sendTo: user.uid,
          createdAt: new Date(),
          video: url,
          user : {
            _id: auth.currentUser.uid
          },
          type: "video"
        }
        setDoc(doc(db, 'chatrooms', docid), {
          draf: [],
          lastmessage: {
            ...message
          },
          participants: [user.uid, auth.currentUser.uid],
          seen: false
        })
        let timeStamp = serverTimestamp()
        const docRef = doc(db, 'chatrooms', docid);
        const colRef = collection(docRef, "messages");
        addDoc(colRef, {
          ...message,
          createdAt: timeStamp
        })
        const colRef2 = collection(docRef, "sharingvideos");
        addDoc(colRef2, {
          url: message.video,
          createdAt: timeStamp
        })
        navigation.goBack()
    }
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center', backgroundColor: 'black'}}>
            <Video
                ref={VideoRef}
                source={video}
                style={{
                    alignSelf: 'center',
                    width:  Dimensions.get('window').width * 0.925,
                    height: Dimensions.get('window').height * 0.9,
                    borderRadius: 20,
                }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping={true}
                    volume={10}

                >
                  
            </Video>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginBottom: 20,
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
                        <Text style={{color: 'black'}}>Gửi video đến</Text>
                        <Text style={{color: 'black', fontSize: 18, opacity: 1, fontWeight: 'bold'}}>{user.displayName}</Text>
                    </View>
                    <TouchableOpacity
                   onPress={() => {UploadMyVideo()}}
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
        </View>
    )
}