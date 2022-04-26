import { collection, collectionGroup, FieldValue, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, onSnapshot} from 'firebase/firestore';
import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, Image, Dimensions, Keyboard} from "react-native";
import {Bubble, GiftedChat , InputToolbar, Send, Time, Composer, Actions} from "react-native-gifted-chat";
import { auth, db1 } from '../../firebase';
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
export default function Chat({route, navigation}){
    const { user } = route.params;
    const { seen } = route.params;
    const { By } = route.params;
    const [mess, setMess] = useState('')
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const [selectedImageView, setSeletedImageView] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const docid = user.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + user.uid : user.uid + "-" + auth.currentUser.uid

    const getAllMessages = async () => {
      const docid = user.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + user.uid : user.uid + "-" + auth.currentUser.uid
      if (By !== auth.currentUser.uid){
        const cRef = doc(db,"chatrooms", docid)
        await updateDoc(cRef, {seen: true}).then(() => {console.log('seen already')})
      }
      const Query = query(collection(db,"chatrooms", docid, "messages"), orderBy("createdAt", 'desc'))
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
    function _emojiSelected(emoji){
      console.log(emoji)
    }
    useEffect(() => {
      return  getAllMessages()
    }, [])

    const onSend = useCallback((messageArray) => {
        //console.log(messageArray)
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: auth.currentUser.uid,
            sendTo: user.uid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        //const docid = user.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + user.uid : user.uid + "-" + auth.currentUser.uid
        setDoc(doc(db, 'chatrooms', docid), {
          draf: [],
          lastmessage: {
            ...mymsg
          },
          participants: [user.uid, auth.currentUser.uid],
          seen: false
        })
        const docRef = doc(db, 'chatrooms', docid);
        const colRef = collection(docRef, "messages");
        addDoc(colRef, {
          ...mymsg,
          createdAt: serverTimestamp()
        })
      })
    const avatar = () => {
      return (
      <FriendsAvatar
       Img={!user.photoURL === "none" ? require('../../assets/user_no_avatar.jpg') : user.photoURL}
        Width={36}
       Height={36} 
      />
      )
    }
    async function UploadMyImage(result) {
      const {url, fileName} = await uploadImage(result, `chatrooms/${docid}`)
      const message = {
        _id: fileName, 
        text: "",
        sentBy: auth.currentUser.uid,
        sendTo: user.uid,
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
        participants: [user.uid, auth.currentUser.uid],
        seen: false
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
              const result = await ImagePicker.launchImageLibraryAsync();
              if (!result.cancelled){
                  await UploadMyImage(result.uri)
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
            imageStyle={
              {
                backgroundColor:'transparent',
                maxHeight: 150,
                maxWidth: 300
              }
            }
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
                        width: 250,
                        height: 175,
                        padding: 6,
                        borderRadius: 10,
                       
                      }}
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
                right: {
                  maxWidth: 200 
                },
                left:{
                  color:'black',
                  maxWidth: 200 
                }
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: "#42C2FF",
                  borderRadius: 10,
                  padding: 2.5
                },
                left: {
                  borderRadius: 10,
                  padding: 2.5
                }
              }}
              
            />}
            minInputToolbarHeight={55}
            locale={vi}
            showAvatarForEveryMessage={false}
            placeholder="Aa"
            renderAvatar={avatar}
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
            //timeTextStyle={{left:{display: 'none', height: 0}, right: {display: 'none',  height: 0}}}
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
                  ['Máy ảnh']: () => {handleProfilePicture(1)},
                  ['Thư viện']: () => {handleProfilePicture(2)}
                }}  
              />
              <Actions
                {...props}
                containerStyle={{width: 27, alignItems: 'center', alignContent: 'center', height: 27, backgroundColor: 'transparent'}}
                icon={() => (
                  <MaterialIcons name="emoji-emotions" size={27} color="#42C2FF" /> 
                  )}
                onPressActionButton={() => {setIsOpen(!isOpen);  Keyboard.dismiss()}}
              />
              <Actions
                {...props}
                containerStyle={{width: 27, alignItems: 'center', alignContent: 'center', height: 27, backgroundColor: 'transparent'}}
                icon={() => (
                  <MaterialIcons name="more-horiz" size={27} color="#42C2FF" />
                )}
                optionTintColor="black"
                options={{
                  ['Tệp đính kèm']: () => {console.log("hmm")},
                  ['Ghi âm']: () => {console.log("hmm")}
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
            onEmojiSelected={(emoji) => {
              setMess(emoji.emoji);
             } }
            categoryPosition="bottom"
             
         />) : <></>}
        </>
    )
}