import { collection, collectionGroup, FieldValue, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, onSnapshot} from 'firebase/firestore';
import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, Image, Dimensions} from "react-native";
import {Bubble, GiftedChat , InputToolbar, Send, Time, Composer} from "react-native-gifted-chat";
import { auth, db1 } from '../firebase';
import { db } from '../firebase';
import { doc, setDoc, addDoc } from 'firebase/firestore';
import { defaultTheme } from '@rneui/base';
import { async } from '@firebase/util';
import FriendsAvatar from '../elements/FriendsAvatar';
import { FontAwesome, Feather, Ionicons  } from '@expo/vector-icons';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo, MaterialIcons  } from '@expo/vector-icons';
const dayjs = require('dayjs');
import vi from 'dayjs/locale/vi'
import EmojiPicker from 'rn-emoji-keyboard';
import Vi from 'dayjs/locale/vi';
export default function Chat({route, navigation}){
    const { user } = route.params;
    const [mess, setMess] = useState('')
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const getAllMessages = async () => {
      const docid = user.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + user.uid : user.uid + "-" + auth.currentUser.uid
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
      const unsubscribe =  getAllMessages()
      return () => unsubscribe()
    }, [])
    const onSend = useCallback((messageArray) => {
        console.log(messageArray)
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: auth.currentUser.uid,
            sendTo: user.uid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        const docid = user.uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + user.uid : user.uid + "-" + auth.currentUser.uid
        setDoc(doc(db, 'chatrooms', docid), {
          draf: []
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
       Img={!user.photoURL === "none" ? require('../assets/user_no_avatar.jpg') : user.photoURL}
        Width={36}
       Height={36} 
      />
      )
    }
    const inputToolbar = (props) => {
      return (
        <View style={{flexDirection:'row', marginTop: 7.5}}>
          <TouchableOpacity style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 5,
            marginBottom:10
          }}>
            <Ionicons name="attach-outline" size={30} color="#42C2FF"/>
          </TouchableOpacity>
          <TouchableOpacity style={{
            marginTop: 10,
            marginLeft: 5,
            marginRight: 5,
            marginBottom:10
          }}>
            <Ionicons name="md-image" size={30} color="#42C2FF"/>
          </TouchableOpacity>
          <TouchableOpacity style={{
            marginTop: 10,
            marginLeft: 5,
            marginRight: 5,
            marginBottom:10
          }}>
            <Ionicons name="mic" size={30} color="#42C2FF"/>
          </TouchableOpacity>
          <View style={{
              backgroundColor: '#eeeeee', 
              width: '52.5%', 
              flexDirection:'row', 
              justifyContent:'center', 
              alignItems:'center',
              borderRadius: 30,
              height: 45,
            }}>
            <View style={{width: '80%', }}>
              <InputToolbar {...props} containerStyle={{width: '95%', height: '92.5%', borderRadius: 30, borderTopWidth: 0, backgroundColor: 'transparent'  }}></InputToolbar>
            <TextInput editable={false} style={{width: '90%', margin: 7.5}}/>
            </View>
            <TouchableOpacity onPress={() => setIsOpen(true)}>
              <MaterialIcons name="emoji-emotions" size={30} color="#42C2FF" /> 
            </TouchableOpacity>
          </View>
          <View>
            <Send {...props}>
              <Ionicons name="send" size={24} color="#42C2FF" style={{margin: 10}}/>
            </Send>
          </View>
        </View>
      )
    }
    return (
      <>
        <View style={{flex: 1, backgroundColor: 'white', paddingBottom: 10}}>
        <GiftedChat
            maxComposerHeight={10}
            scrollToBottom={true}
            scrollToBottomStyle={{
              backgroundColor: 'white'
            }}
            alwaysShowSend={true}
            scrollToBottomOffset={10}
            scrollToBottomComponent ={() => {
              return (
                <View style={{justifyContent: 'center',}}>
                  <Entypo name="chevron-down" size={24} color="black" />
                </View>
              )
            }
            }
            renderBubble={(props) => <Bubble {...props}
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
                  padding: 4,
                  borderRadius: 30
                },
                left: {
                  padding: 4,
                  borderRadius: 30
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
            renderSend={() => {<></>}}
            timeTextStyle={{left:{display: 'none', height: 0}, right: {display: 'none',  height: 0}}}
            renderInputToolbar={(props) => inputToolbar(props)}
          />
        </View>
        <EmojiPicker 
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
          containerStyles={{marginBottom: 15}}
          categoryColor='white'
          categoryContainerColor='#42C2FF'
          activeCategoryColor='#42C2FF'
          categoryContainerStyles={{width: Dimensions.get('window').width * 0.925, }}
          onEmojiSelected={() => setIsOpen(true)}
          open={isOpen}
          onClose={() => setIsOpen(false)}
         />
        </>
    )
}