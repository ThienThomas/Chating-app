import { View, Text, FlatList, Image, Dimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Vi from 'dayjs/locale/vi'
import { auth } from '../../firebase'
import { db } from '../../firebase'
import { collection, onSnapshot, query , orderBy} from 'firebase/firestore'
import GridImageView from 'react-native-grid-image-viewer';
import { Video } from 'expo-av'
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Tab = createMaterialTopTabNavigator()
export default function SharingGroup({route}) {
  const group_item = route.params.group_item
  //console.log(user)

  const docid = group_item.roomid
  const [imageList, setImageList] = useState([])
  const [videoList, setVideoList] = useState([])
  const [DocsList, setDocsList] = useState([])
  //useState
  //console.log(docid)
  useState(() => {
    if (auth.currentUser) {
        const Query1 = query(collection(db,"chatgroups", docid, "sharingimages"), orderBy("createdAt", 'desc'))
        onSnapshot(Query1, (querySnapshot)=>{
            let images = []
            querySnapshot.forEach((doc) => {
                images.push(doc.data().url)
            })
            setImageList(images)
            //console.log(imageList)
        })
    }
    //setImageList(images)

    //console.log(images)
  })
  useState(() => {
   // let videos = []
    if (auth.currentUser) {
        const Query2 = query(collection(db,"chatgroups", docid, "sharingvideos"), orderBy("createdAt", 'desc'))
        onSnapshot(Query2, (querySnapshot)=>{
            let videos = []
            querySnapshot.forEach((doc) => {
                videos.push(doc.data().url)
            })
            setVideoList(videos)
            //console.log(videoList)
        })
    }
  })
  useState(() => {
      //let docs = [];
    if (auth.currentUser) {
        const Query3 = query(collection(db,"chatgroups", docid, "sharingdocs"), orderBy("createdAt", 'desc'))
        onSnapshot(Query3, (querySnapshot)=>{
            let docs = [];
            querySnapshot.forEach((doc) => {
                //console.log(doc.data().url)
                docs.push(doc.data())
            })
            setDocsList(docs)
            //console.log(DocsList)
        })
    }
      //setDocsList(docs)
      //console.log(docs)
  })
  //const Query3 = query(collection(db,"chatrooms", docid, "sharingdocs"), orderBy("createdAt", 'desc'))
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {backgroundColor: "#42C2FF"}
            }}
        >
            <Tab.Screen children={() => <SharedImage imageList={imageList}></SharedImage>} name="Hình ảnh"></Tab.Screen>
            <Tab.Screen children={() => <SharedVideo videoList={videoList}></SharedVideo>} name="Video"></Tab.Screen>
            <Tab.Screen children={() => <SharedDocs DocsList={DocsList}></SharedDocs>} name="File đính kèm"></Tab.Screen>
        </Tab.Navigator>
    </View>
  )
}
function SharedImage({imageList}){
    const renderItem = ({item}) => {
        console.log(item)
        return (
            <View style={{
                //height: Dimensions.get('window').height * 0.4,
                width: Dimensions.get('screen').width * 0.33333334, height: Dimensions.get('screen').width * 0.33333334,
                borderRadius: 20,
                justifyContent: "center"
              }}>
                <Image source={{uri: item}} style={{width: "100%", height: "100%"}} resizeMode='cover' />
            </View>
        )
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white', justifyContent: "space-between"}}>
            <FlatList data={imageList} renderItem={renderItem} numColumns={3}>

            </FlatList>
        </View>
    )
}
function SharedVideo({videoList}){
    const renderItem = ({item}) => {
        console.log(item)
        return (
            <View style={{
                //height: Dimensions.get('window').height * 0.4,
                width: Dimensions.get('screen').width * 0.33333334, height: Dimensions.get('screen').width * 0.33333334,
                borderRadius: 20,
                justifyContent: "center"
              }}>
                <Video source={{uri: item}} style={{width: "100%", height: "100%"}} usePoster useNativeControls resizeMode='cover'></Video>
            </View>
        )
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white', justifyContent: "space-between"}}>
            <FlatList data={videoList} renderItem={renderItem} numColumns={3}>

            </FlatList>
        </View>
    )
}
function SharedDocs({DocsList}){
    const renderItem = ({item}) => {
        return (
            <View style={{margin: 5}}>
                <TouchableOpacity onPress={() => {Linking.openURL(item.url)}} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name="download-circle" size={20} color="#42C2FF" /><Text>&nbsp;</Text><Text>{item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white', padding: 10}}>
           <FlatList data={DocsList} renderItem={renderItem}></FlatList>
        </View>
    )
}