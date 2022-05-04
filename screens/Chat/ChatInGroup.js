import { collection, collectionGroup, FieldValue, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, onSnapshot} from 'firebase/firestore';
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, Image, Dimensions, Keyboard, Alert, Modal} from "react-native";
import {Bubble, GiftedChat , InputToolbar, Send, Time, Composer, Actions, MessageText} from "react-native-gifted-chat";
import { auth, db1 } from '../../firebase';
import { StyleSheet } from 'react-native';
import { db } from '../../firebase';
import { doc, setDoc, addDoc } from 'firebase/firestore';
import { defaultTheme } from '@rneui/base';
import { async } from '@firebase/util';
import * as ImagePicker from 'expo-image-picker'
import ImageView from "react-native-image-viewing";
import FriendsAvatar from '../../elements/FriendsAvatar';
import { FontAwesome, Feather, Ionicons, EvilIcons  } from '@expo/vector-icons';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo, MaterialIcons  } from '@expo/vector-icons';
const dayjs = require('dayjs');
import vi from 'dayjs/locale/vi'
import EmojiPicker, { EmojiKeyboard } from 'rn-emoji-keyboard';
import Vi from 'dayjs/locale/vi';
import { uploadImage } from '../../utils';
import {Camera} from 'expo-camera'
import { MediaType } from 'expo-media-library';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConvertExtension from './Function/ConvertExtension';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import RecordAudio from './Function/RecordAudio';
import FetchingGif from './Function/FetchingGif';
import FetchingGifGroup from './Function/FetchingGifGroup';

const styles = StyleSheet.create({
  containerContent: {height: 100, marginTop: 40},
  containerHeader: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: 'red',
  },
  headerContent:{
    marginTop: 0,
    height: 10
  },
  Modal: {
    backgroundColor: 'white',
    height:  100,
    marginTop: Dimensions.get('window').height * 0.75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10
  },
  Modal2: {
    backgroundColor: 'white',
    height:  100,
    marginTop: Dimensions.get('window').height * 0.35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10
  },
});
//const video = Video
export default function ChatInGroup({route, navigation}){
    const { group_item, users } = route.params;
    //console.log(users)
    const [mess, setMess] = useState('')
    const [messages, setMessages] = useState([]);
    //const [emojiSelected, setEmojiSelected] = useState('');
    const [modalRecordingVisible, setModalRecordingVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [selectedImageView, setSeletedImageView] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalRecordingAnimation, setModalRecordingAnimation] = useState(false);
    const [modalGif, setModalGif] = useState(false)
    const [modalGifAnimation, setModalGifAnimation] = useState(false);
    const [avatarList, setAvatarList] = useState([]);
    const docid = group_item.roomid
    const getAllMessages = async () => {
      //const docid = user.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + user.uid : user.uid + "-" + auth.currentUser.uid
    const Query = query(collection(db,"chatgroups", docid, "messages"), orderBy("createdAt", 'desc'))
    const unsubscribe1 = onSnapshot(Query, (querySnapshot) => {
        try{
        let allmsg = querySnapshot.docs.map(
            message => {
                return {
                ...message.data(),
                createdAt: message.data().createdAt.toDate()
            }
          }
        )
        setMessages(allmsg)
      }
      catch(error){
        console.log(error)
      }
      })
    }
    useEffect(() => {
        return getAllMessages()
    }, [])
    useEffect(() => {
      const KeyboardDidShowListenner = Keyboard.addListener('keyboardDidShow', () => {setIsOpen(false)})
      return () =>  {KeyboardDidShowListenner.remove()}
    }, [])
      const HandleEmojiSelect = (emoji) => {
        setMess(emoji.emoji)
    }
    const onSend = useCallback((messageArray) => {
        //console.log(messageArray)
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: auth.currentUser.uid,
            //sendTo: user.uid,
            createdAt: new Date(),
            type: "text"
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        //const docid = user.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + user.uid : user.uid + "-" + auth.currentUser.uid
        updateDoc(doc(db, 'chatgroups', docid), {
          draf: [],
          lastmessage: {
            ...mymsg
          },
          //participants: [user.uid, auth.currentUser.uid],
          //seen: false
        })
        const docRef = doc(db, 'chatgroups', docid);
        const colRef = collection(docRef, "messages");
        addDoc(colRef, {
          ...mymsg,
          createdAt: serverTimestamp()
        })
        /*const colRef2 = collection(docRef, "sharing");
        addDoc(colRef2, {
          images: [],
          videos: [],
          docs: [],
        })*/
      })
      
    async function UploadMyImage(result) {
      const {url, fileName} = await uploadImage(result, `chatrooms/${docid}`)
      const message = {
        _id: fileName, 
        text: "",
        sentBy: auth.currentUser.uid,
        //sendTo: user.uid,
        createdAt: new Date(),
        image: url,
        user : {
          _id: auth.currentUser.uid,
        }
      }        
      setMessages(previousMessages => GiftedChat.append(previousMessages, message))
      setDoc(doc(db, 'chatrooms', docid), {
        draf: [],
        lastmessage: {
          ...message
        },
        //participants: [user.uid, auth.currentUser.uid],
        //seen: false
      })
      const docRef = doc(db, 'chatrooms', docid);
      const colRef = collection(docRef, "messages");
      addDoc(colRef, {
        ...message,
        createdAt: serverTimestamp()
      })
    }
    async function handleProfilePicture(val){
          if (val === 1){
                const result = await ImagePicker.launchCameraAsync();
                if (!result.cancelled){
                    await UploadMyImage(result.uri)
                }
            }
            else if (val === 2){
                const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.All, videoMaxDuration: 60, videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low});
                if (!result.cancelled){
                    if (result.type == 'image') {
                    navigation.navigate('pickphotogroup', {image: result,  docid: docid})
                    }
                    else {
                    navigation.navigate('pickvideogroup', {video: result, docid: docid})
                }
            } 
        }
    }
    async function handleDocumentPicker(){
      //let result = []
      
      const result = await DocumentPicker.getDocumentAsync({type: 'application/*', multiple: true, copyToCacheDirectory: true})
      if (result.type === 'success'){
        let extension = result.uri.substring(result.uri.lastIndexOf('.') + 1);
        let converted_extension = ConvertExtension(extension)
        if (converted_extension !== 'not_support') {
          navigation.navigate('pickdocgroup', {document: result, docid: docid, ext: converted_extension})
        }
        else {
          Alert.alert('Có lỗi xảy ra', 'Định dạng file không được hỗ trợ !', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }
      }
    }
    return (
      <>
        <View style={{flex: 1, backgroundColor: 'white', paddingBottom: 10}}>
        <GiftedChat
            text={mess}
            onInputTextChanged={(text)=> {setMess(text)
              //console.log(mess)
            }}
            maxComposerHeight={10}
            scrollToBottom={true}
            scrollToBottomStyle={{
              backgroundColor: 'white'
            }}
            alwaysShowSend={false}
            scrollToBottomOffset={10}
            scrollToBottomComponent ={() => {
              return (
                <View style={{justifyContent: 'center',}}>
                  <Entypo name="chevron-down" size={24} color="black" />
                </View>
              )
            }
            }
            renderCustomView={(props) => {
              if (props.currentMessage.doc_name) {
                return (
                  <View style={{padding: 10}}>
                    <TouchableOpacity onPress={() => {
                      Alert.alert(props.currentMessage.doc_name, `Kích thước: ${props.currentMessage.size} MB`, [
                        { text: 'HỦY', onPress: () => console.log('OK Pressed') },
                        { text: 'TẢI XUỐNG', onPress: () => {Linking.openURL(props.currentMessage.doc_id)} },
                      ])
                      }} style={{flexDirection: 'row', alignItems: 'center'}} >
                    <MaterialCommunityIcons name="download-circle" size={20} color="#42C2FF" /><Text>&nbsp;</Text>
                    <Text style={{fontSize: 14, textDecorationLine: 'underline'}}>{props.currentMessage.doc_name}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }
              else if (props.currentMessage.gif) {
                return (
                  <View style={{padding: 10}}>
                      <Image
                        resizeMode='contain'
                        style={{
                            width: 150,
                            height: 150,
                            borderWidth: 3,
                            borderRadius: 10,
                        }}
                        source={{uri: props.currentMessage.gif}}
                       ></Image>
                    </View>
                )
              }
               return null
            }}
            /*renderSystemMessage = {(props) => {
              return (
                <View style={{backgroundColor: "#42c2ff", alignItems:'center', width: '75%', alignSelf: 'center', borderRadius: 10, margin: 10}}>
                    <Text style={{color: 'white'}}>{props.currentMessage.text}</Text>
                </View>
              )
            }}*/
            renderMessageAudio = {(props) => {
                return (
                  <View style={{
                    //height: Dimensions.get('window').height * 0.4,
                    width: Dimensions.get('window').width * 0.7,
                    height:   Dimensions.get('window').width * 0.45,
                    borderRadius: 20,
                    margin: 1
                    
                  }}>
                    <Video 
                      resizeMode='cover'
                      usePoster={true}
                      useNativeControls
                      source={{uri: props.currentMessage.audio}}
                      //shouldPlay={true}
                      style={{
                        //height: Dimensions.get('window').height * 0.4,
                        width: Dimensions.get('window').width * 0.7,
                        height:   Dimensions.get('window').width * 0.45,
                        borderRadius: 20,
                        margin: 1
                      }}
                      >
                    </Video>
                  </View>
              );
            }}
            renderMessageVideo ={(props) => {
              return (
                <View style={{
                  //height: Dimensions.get('window').height * 0.4,
                  width: Dimensions.get('window').width * 0.7,
                  height:   Dimensions.get('window').width * 0.45,
                  borderRadius: 20,
                  margin: 1
                }}>
                  <Video 
                    resizeMode='cover'
                    usePoster={true}
                    useNativeControls
                    source={{uri: props.currentMessage.video}}
                    //shouldPlay={true}
                    style={{
                      //height: Dimensions.get('window').height * 0.4,
                      width: Dimensions.get('window').width * 0.7,
                      height:   Dimensions.get('window').width * 0.45,
                      borderRadius: 20,
                      margin: 1
                    }}
                    >
                  </Video>
                </View>
              )
            }}
            renderMessageImage={(props) => {
              return (
                <View style={{ borderRadius: 15, padding: 2 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      setSeletedImageView(props.currentMessage.image);
                    }}
                  >
                    <Image
                      style={{
                        width: Dimensions.get('window').width * 0.55,
                        height: Dimensions.get('window').height * 0.55,
                        padding: 6,
                        borderRadius: 20,
                       
                      }}
                     resizeMode='cover'
                      source={{ uri: props.currentMessage.image }}
                    />
                    {selectedImageView ? (
                      <ImageView
                        imageIndex={0}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                        images={[{ uri: selectedImageView}]}
                      />
                    ) : null}
                  </TouchableOpacity>
                </View>
              );
            }}
            renderBubble={(props) => <Bubble
               {...props}
              onLongPress={() => {alert("Hmm")}}
              textStyle={{
                  left:{
                    color: 'black'
                  },
                  right:{
                    color: 'black'
                  }
                }
              }
              wrapperStyle={{
                right: {
                  backgroundColor: "transparent",
                  borderRadius: 20,
                  borderWidth: 0.5,
                  borderColor: "#d1d1d1",
                  padding: 1,
                },
                left: {
                  borderRadius: 20,
                  padding: 1,
                  backgroundColor: "#eeeeee",
                  //borderRadius: 10,
                  borderWidth: 0.65,
                  borderColor: "#eeeeee"
                }
              }}
            />}
            minInputToolbarHeight={55}
            locale={vi}
            showAvatarForEveryMessage={false}
            placeholder="Aa"
            renderAvatar={(props) => {
                let item = users.find(element => element.uid === props.currentMessage.user._id)
                //console.log(item.photoURL);
                return ( 
                    <FriendsAvatar
                        Img={!item.photoURL === "none" ? require('../../assets/user_no_avatar.jpg') : item.photoURL}
                        Width={36}
                        Height={36} 
                    />
                )
            }}
            messages={messages}
            onSend={onSend}
            user={{
                _id: auth.currentUser.uid,
            }}
            renderSend={(props) => { 
              return (
                <Send
                {...props}
                  containerStyle={{ justifyContent: 'center', alignItems:'center', paddingRight: 10, paddingLeft: 10}}
                >
                  <Ionicons name="send" size={30} color="#42C2FF" />
                </Send>
              );
            }}
            timeTextStyle={{left:{color: 'grey'}, right: {color: 'grey'}}}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                primaryStyle={{
                    margin: 5,
                    borderRadius: 20,
                    paddingTop:2.5,
                    paddingBottom: 2.5,
                  }}
                containerStyle={{
                  borderTopWidth: 0.25,
                  borderTopColor: "#d1d1d1",
                  justifyContent:'center',
                }}
              />
            )}
            renderActions={(props) => (
              <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
              }}>
              <Actions
                {...props}
                containerStyle={{ width: 27, alignItems: 'center', alignContent: 'center', height: 27}}
                icon={() => (
                  <Ionicons name="camera" size={27} color="#42C2FF" />
                )}
                
                optionTintColor="black"
                options={{
                  ['Máy ảnh']:  async () => { //Camera.requestCameraPermissionsAsync(); navigation.navigate('takephoto', {user: user, docid: docid})
                    },
                  ['Video'] : () => {handleProfilePicture(3)},
                  ['Thư viện']: () => {handleProfilePicture(2)}
                }}  
              />
              <Actions
                {...props}
                containerStyle={{width: 27, alignItems: 'center', alignContent: 'center', height: 27, backgroundColor: 'transparent'}}
                icon={() => (
                  <MaterialIcons name="emoji-emotions" size={27} color="#42C2FF" /> 
                  )}
                //onPressActionButton={() => {setIsOpen(!isOpen);  Keyboard.dismiss()}}
                optionTintColor="black"
                options={{
                  ['Biểu tượng cảm xúc'] : () => {setIsOpen(!isOpen); Keyboard.dismiss()},
                  ['GIF'] : () => {setModalGif(true)}
                }}
              />
              <Actions
                {...props}
                containerStyle={{width: 27, alignItems: 'center', alignContent: 'center', height: 27, backgroundColor: 'transparent'}}
                icon={() => (
                  <MaterialIcons name="more-horiz" size={27} color="#42C2FF" />
                )}
                optionTintColor="black"
                options={{
                  ['Tệp đính kèm']: () => {handleDocumentPicker()},
                  ['Ghi âm']: () => {setModalRecordingVisible(true)}
                }}  
              />
              </View>
            )}
          />
        </View>
        {isOpen === true ? (
        <EmojiKeyboard 
          translation={{
            smileys_emotion: 'BIỂU TƯỢNG CẢM XÚC',
            people_body: 'MỌI NGƯỜI',
            animals_nature: 'ĐỘNG VẬT VÀ THIÊN NHIÊN',
            food_drink: 'THỰC PHẨM VÀ ĐỒ UỐNG',
            travel_places: 'DU LỊCH VÀ ĐỊA ĐIỂM',
            activities: 'HOẠT ĐỘNG VÀ SỰ KIỆN',
            objects: 'ĐỐI TƯỢNG',
            symbols: 'BIỂU TƯỢNG',
            flags: 'CỜ',
          }}
          //categoryColor='white'
          //categoryContainerColor='#42C2FF'
            activeCategoryColor='#42C2FF'
            categoryContainerStyles={{marginBottom: 10}}
            onEmojiSelected={HandleEmojiSelect}
            categoryPosition="bottom"
         />) : <></>}
          <SwipeUpDownModal
           modalVisible={modalRecordingVisible}
           PressToanimate={modalRecordingAnimation}
           ContentModal={
            <>
              <View style={{height:7, width: 75, backgroundColor: '#d1d1d1', borderRadius: 10, alignSelf:'center'}}></View>  
            </>   
           }
           HeaderStyle={{
            marginTop: 0,
            height: 10
           }}
           duration={500}
           ContentModalStyle={styles.Modal}
            onClose={() => {
                setModalRecordingVisible(false);
                setModalRecordingAnimation(false);
            }}
           >
          </SwipeUpDownModal>
          <SwipeUpDownModal
          
           modalVisible={modalGif}
           PressToanimate={modalGifAnimation}
           ContentModal={
            <>
              <View style={{height:7, width: 75, backgroundColor: '#d1d1d1', borderRadius: 10, alignSelf:'center'}}></View>  
              <FetchingGifGroup docid={docid}></FetchingGifGroup>
            </>   
           }
           HeaderStyle={{
            marginTop: 0,
            height: 10
           }}
           duration={500}
           ContentModalStyle={styles.Modal2}
            onClose={() => {
                setModalGif(false);
                setModalGifAnimation(false);
            }}
           >
          </SwipeUpDownModal>
        </>
    )
}
