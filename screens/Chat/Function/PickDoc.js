import React from "react";
import { View , Text} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import {Fontisto, FontAwesome } from '@expo/vector-icons';
import { uploadDocuments } from "../../../utils";
import { auth, db } from '../../../firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
export default function PickDoc({route}){
    const ext = route.params.ext
    const document = route.params.document
    const user = route.params.user
    const docid = route.params.docid
    const navigation = useNavigation()
    console.log(document)
    async function UploadDocs(){
        const {url, fileName} = await uploadDocuments(document.uri,  `chatrooms/${docid}/documents/`, ext)
        const message = {
          _id : fileName,
          text: "",
          sentBy: auth.currentUser.uid,
          sendTo: user.uid,
          createdAt: new Date(),
          user : {
            _id: auth.currentUser.uid
          },
          doc_name: document.name,
          doc_id: url,
          size: Math.round((document.size / 1024) / (1024) * 100) / 100,
          type: "document"
          
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
        const colRef2 = collection(docRef, "sharingdocs");
        addDoc(colRef2, {
          url: message.doc_id,
          name: message.doc_name,
          createdAt: timeStamp
        })
        navigation.goBack()
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white', paddingLeft: 25, paddingRight: 25}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{backgroundColor: "#42C2FF", width: 35, height: 35, padding: 2.5, justifyContent:'center', alignItems: 'center', borderRadius: 50}}>
                    <AntDesign name="filetext1" size={20} color="white" /> 
                </View> 
                <View style={{marginLeft: 10}}>
                    <Text>{document.name}</Text>
                </View>
            </View>
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
                        <Text style={{color: 'black'}}>Gửi tệp đến</Text>
                        <Text style={{color: 'black', fontSize: 18, opacity: 1, fontWeight: 'bold'}}>{user.displayName}</Text>
                    </View>
                    <TouchableOpacity
                   onPress={() => {UploadDocs()}}
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