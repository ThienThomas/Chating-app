import React, {useState, useEffect, useContext} from "react";
import { View, Text} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { GlobalContext } from "../../GlobalContext";
import { UseGlobalContext } from "../../GlobalContext";
import { DocumentReference, getDocsFromServer, getDocs, getFirestore, limit, orderBy } from 'firebase/firestore';
import { collection, onSnapshot, query, where, doc, getDoc} from "firebase/firestore";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { Dimensions } from "react-native";
import { Feather, FontAwesome} from '@expo/vector-icons';
import { KeyboardAvoidingView } from "react-native";
import { async } from "@firebase/util";

export default function Chats(){
  return (
    <UseGlobalContext>
      <ListChats></ListChats>
    </UseGlobalContext>
  )
}
function ListChats(){
    const globalContext = useContext(GlobalContext);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [listFriends, setListFriends] = useState([])
    const [listChats, setListChats] = useState([])
    const [listRooms, setListRooms] = useState([])
    const navigation = useNavigation()
    const [isBusy, setIsBusy] = useState(true)
    /*console.log(masterDataSource)
    console.log(listChats)
    console.log(listFriends)
    console.log(listRooms)*/
    /*useEffect(() => {
      if (globalContext.isBusy === false){
        setMasterDataSource(globalContext.masterData)
        setIsBusy(false)
        console.log("chat", "=>", masterDataSource)
      }
      else {
        setIsBusy(true)
      }
    }, [])*/
    /*useEffect(() => {
      setIsBusy(true)
      const unsubscribe = async  () => {
      try{
        const colRef = query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid))
        let Docs = await getDocsFromServer(colRef)
        Docs.docs.map((doc) => {
          console.log(doc.data());
        })
        
      }catch(error) {
        console.log(error)
      }
      setIsBusy(false)
    }
    return () => unsubscribe()
    },[])*/
    /*useEffect(() => {
       setIsBusy(true)
       console.log(masterDataSource)
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let listF = [];
          let listC = [];
          querySnapshot.forEach((doc) => {
            listF = doc.data().listfriends
            listC = doc.data().listchats
          })
          setListFriends(listF)
          setListChats(listC)
        })
        setIsBusy(false)
        return () => unsubscribe()
      }, []);*/
    /*useEffect(() => {
      const q1 = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
      const unsubscribe = onSnapshot(q1, (querySnapshot) => {
        let listC = [];
        querySnapshot.forEach((doc) => {
          listC = doc.data().listchats
        })
        if (listC.length !== 0) {
          let listMess = []
          console.log(listC)
          listC.forEach(async (value) => {
            console.log(value)
            const getdoc = await getDoc(db, "chatrooms", value)
            console.log(getdoc.data())
          })
        }
      })
      return () => unsubscribe()
     })*/
     /*useEffect(() => {
      setIsBusy(true)
      if (masterDataSource.length !== 0) {
        console.log(1)
        const q1 = query(collection(db, "chatrooms"), where("participants", 'array-contains', auth.currentUser.uid))
        const unsubscribe = onSnapshot(q1, (querySnapshot) => {
        const rooms = [];
        querySnapshot.docs.map((doc) => {
          let room = doc.data()
          //console.log(room)
          const userinroom = masterDataSource.find(element => element.uid == room.lastmessage.sentBy || element.uid == room.lastmessage.sendTo)
          room.photoURL = userinroom.photoURL
          room.displayName = userinroom.displayName
          room.uid = userinroom.uid
          //console.log(room)
          //console.log(userinroom.photoURL)
          rooms.push(room)
        })
        //console.log(rooms)
        setListRooms(rooms)
        setIsBusy(false)
        })
        return () => unsubscribe()
      }
     }, [])*/
      const searchFilterFunction = (text) => {
        if (text) {
          const newData = listRooms.filter(function (item) {
            const itemData = item.displayName ? item.displayName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          setFilteredDataSource([]);
          setSearch(text);
        }
      };
    const ItemView = ({item}) => {
        let userInfo;
        if (!globalContext.chatRooms && !globalContext.isBusy) {
          console.log("Waiting ...")
        }
        else {
          userInfo = globalContext.masterData.find(element => element.uid == item.lastmessage.sentBy || element.uid == item.lastmessage.sendTo)
          console.log(userInfo)
        }
        return (
          <>
            {!globalContext.chatRooms && !globalContext.masterDataIsOnGetting ?  (<></>) : (<>
           <TouchableOpacity onPress={() => {navigation.navigate('chat', {user: userInfo})}}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15
            }}>
              <FriendsAvatar
                Img={userInfo.photoURL}
                Width={55}
                Height={55}
              />
              <View style={{marginLeft: 15}}>
              <Text  style={{fontWeight: 'bold', fontSize: 18}}>
                  {userInfo.displayName}
              </Text>
              <Text style={{
                fontWeight: !item.seen && item.lastmessage.sendTo === auth.currentUser.uid ? 'bold' : 'normal'
              }}>
                {item.lastmessage.sentBy != auth.currentUser.uid ? null : "Bạn: "} {item.lastmessage.text}
              </Text>
              </View>
              <View  style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: Dimensions.get('window').width * 0.45
              }}>
              </View>
            </View>
            </TouchableOpacity>
            </>)}
          </>
        );
    };
    const getItem = (item) => {
     alert(item.uid)
    };
    return (
          <>
            <View style={{backgroundColor: 'white', height: "100%", padding: 5}}>
                <SearchBar 
                round 
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                searchIcon={{ size: 24, color: 'black'}}
                containerStyle={{
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                }}
                inputStyle={{
                    backgroundColor:"#EEEEEE"
                }}
                inputContainerStyle={{
                    backgroundColor:"#EEEEEE"
                }}
                placeholder="Tìm kiếm"
                placeholderTextColor={"#B2B1B9"}
                value={search}
            >
            </SearchBar>
            <KeyboardAvoidingView>
            <FlatList
                data={globalContext.chatRooms}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}  
                showsHorizontalScrollIndicator={false}  
                showsVerticalScrollIndicator={false}
                style={{marginBottom: 85, padding: 10}}
            >
            </FlatList>
            </KeyboardAvoidingView>
        </View>
        {!globalContext.isPending ?  null : <AppLoadingAnimation />}
        </>
    )
}