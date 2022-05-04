import React, {useState, useEffect, useContext} from "react";
import { View, Text} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { GlobalContext } from "../../GlobalContext";
import { UseGlobalContext } from "../../GlobalContext";
import { DocumentReference, getDocsFromServer, getDocs, getFirestore, limit, orderBy, serverTimestamp } from 'firebase/firestore';
import { collection, onSnapshot, query, where, doc, getDoc} from "firebase/firestore";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { Dimensions } from "react-native";
import { Feather, FontAwesome} from '@expo/vector-icons';
import { KeyboardAvoidingView } from "react-native";
import { async } from "@firebase/util";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator()
export default function Chats(){
  return (
    <UseGlobalContext>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {backgroundColor: "#42C2FF"}
        }}
      >
        <Tab.Screen
          component={ListChats}
          name="Bạn bè"
        >
        </Tab.Screen>
        <Tab.Screen
          component={GroupChats}
          name="Nhóm"
        >
        </Tab.Screen>
      </Tab.Navigator>
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
          //console.log(userInfo)
        }
        return (
          <>
            {!globalContext.chatRooms && !globalContext.masterDataIsOnGetting ?  (<></>) : (<>
           <TouchableOpacity onPress={() => {navigation.navigate('chat', {user: userInfo, seen: item.seen, By: item.lastmessage.sentBy })}}>
            <View style={{
              flexDirection: 'row',
              alignItems:'center',
              marginBottom: 15,
            }}>
              <View style={{width: 55}}>
              <FriendsAvatar
                Img={userInfo.photoURL}
                Width={55}
                Height={55}
              />
              </View>
              <View style={{marginLeft: 15, marginRight: 5, flex: 1}}>
                <View style={{
                    justifyContent:'space-between', 
                    flexDirection: 'row',                    
                  }}>
                    <Text  style={{fontWeight: 'bold', fontSize: 18, textAlign:'center'}}>
                      {userInfo.displayName} 
                    </Text >
                    <View style={{justifyContent:'center'}}>
                    <Text >
                      {new Date(item.lastmessage.createdAt.toDate()).toLocaleDateString()}
                    </Text>
                    </View>
                </View>
                <View>
                <View style={{
                    justifyContent:'space-between', 
                    flexDirection: 'row',      
                  }}>
                <Text style={{
                  fontWeight: !item.seen && item.lastmessage.sendTo === auth.currentUser.uid ? 'bold' : 'normal'
                }}>
                  {item.lastmessage.system ? (<>{item.lastmessage.text}</>):(<>
                    {item.lastmessage.sentBy != auth.currentUser.uid ? null : "Bạn: "}{item.lastmessage.type === "text" ? item.lastmessage.text : (<>
                    {item.lastmessage.type === "video" ? "Video" : (<>
                      {item.lastmessage.type === "image" ? "Hình ảnh" : <>
                        {item.lastmessage.type === "document" ? "Đã gửi một tệp đính kèm" : (<>
                          {item.lastmessage.type === "audio" ? "Đã gửi một clip thoại" : (<>
                            {item.lastmessage.type === "gif" ? "GIF" : <></>}</>)}
                        </>)}</>}
                    </>)}
                  </>)} 
                  </>)}
                  
                </Text>
                  <View style={{justifyContent:'center'}}>
                  {!item.seen && item.lastmessage.sentBy !== auth.currentUser.uid ? <View style={{width: 10 ,height: 10, backgroundColor:'#42C2FF', borderRadius: 20}}></View> :<></>} 
                  </View>
                </View>
                </View>
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

function GroupChats() {
  const globalContext = useContext(GlobalContext);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [listFriends, setListFriends] = useState([])
  const [listChats, setListChats] = useState([])
  const [listRooms, setListRooms] = useState([])
  const navigation = useNavigation()
  const [isBusy, setIsBusy] = useState(true)
  
    const searchFilterFunction = (text) => {
      if (text) {
        const newData = listRooms.filter(function (item) {
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
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
      /*let userInfo;
      if (!globalContext.chatRooms && !globalContext.isBusy) {
        console.log("Waiting ...")
      }
      else {
        userInfo = globalContext.masterData.find(element => element.uid == item.lastmessage.sentBy || element.uid == item.lastmessage.sendTo)
        //console.log(userInfo)
      }*/
      return (
        <>
          {!globalContext.chatRooms && !globalContext.masterDataIsOnGetting ?  (<></>) : (<>
            <TouchableOpacity onPress={() => {navigation.navigate('chatingroup', {group_item: item, users: globalContext.masterData})}}>
          <View style={{
            flexDirection: 'row',
            alignItems:'center',
            marginBottom: 15,
          }}>
            <View style={{width: 55}}>
            <FriendsAvatar
              Img={item.avatar}
              Width={55}
              Height={55}
              Type={true}
            />
            </View>
            <View style={{marginLeft: 15, marginRight: 5, flex: 1}}>
              <View style={{
                  justifyContent:'space-between', 
                  flexDirection: 'row',                    
                }}>
                  <Text  style={{fontWeight: 'bold', fontSize: 18, textAlign:'center'}}>
                    {item.name} 
                  </Text >
                  <View style={{justifyContent:'center'}}>
                  <Text >
                    {new Date(item.lastmessage.createdAt.toDate()).toLocaleDateString()}
                  </Text>
                  </View>
              </View>
              <View>
              <View style={{
                  justifyContent:'space-between', 
                  flexDirection: 'row',      
                }}>
              <Text style={{
                fontWeight: !item.seen && item.lastmessage.sendTo === auth.currentUser.uid ? 'bold' : 'normal'
              }}>
                {item.lastmessage.system ? (<>{item.lastmessage.text}</>):(<>
                  {item.lastmessage.sentBy != auth.currentUser.uid ? null : "Bạn: "}{item.lastmessage.type === "text" ? item.lastmessage.text : (<>
                  {item.lastmessage.type === "video" ? "Video" : (<>
                    {item.lastmessage.type === "image" ? "Hình ảnh" : <>
                      {item.lastmessage.type === "document" ? "Đã gửi một tệp đính kèm" : (<>
                        {item.lastmessage.type === "audio" ? "Đã gửi một clip thoại" : (<>
                          {item.lastmessage.type === "gif" ? "GIF" : <></>}</>)}
                      </>)}</>}
                  </>)}
                </>)} 
                </>)}
              </Text>
               
              </View>
              </View>
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
              data={globalContext.listGroupChat}
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