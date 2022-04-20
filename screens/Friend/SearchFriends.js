import React, { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { query, collection, where, onSnapshot} from "firebase/firestore";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { SearchBar } from "react-native-elements";
import { Feather } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { KeyboardAvoidingView } from "react-native";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { sendingMyRequest, revokeRequest } from "../../mymodules/FriendsTabProcessing";
import { GlobalContext, UseGlobalContext } from "../../GlobalContext";
import { useNavigation } from "@react-navigation/native";
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5
    },
    tabcontainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      justifyContent:'space-between'
    },
    button: {
      borderRadius: 100, 
      paddingLeft: 10, 
      paddingRight: 10, 
      paddingTop: 5, 
      paddingBottom: 5,
    },
      sendingRequest: { 
        backgroundColor: "#1590C4"},
      revokeRequest:{ 
        backgroundColor: "#FF5757"
      },
      textingme: {
        backgroundColor: "orange"
      },
      accept: {
        backgroundColor: "green"
      }
  })
export default function SearchFriends() {
  return (
    <UseGlobalContext>
      <SearchFriend></SearchFriend>
    </UseGlobalContext>
  )
}
function SearchFriend() {
    const input = React.createRef();
    const navigation = useNavigation()
    const globalContext = useContext(GlobalContext)
    const [search, setSearch] = useState('');
    //const [masterDataSource, setMasterDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    //const [listFriends, setListFriends] = useState([])
    //const [isBusy, setIsBusy] = useState(true)
    //const [sendingRequest, setSendingRequest] = useState([])
    useEffect(() => {
        input.current.focus()
        
    }, [])/*
    useEffect(() => {
        setIsBusy(true)
        const q1 = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
        const unsubscribe = onSnapshot(q1, (querySnapshot) => {
          let request = []
          let ListF = []
          querySnapshot.forEach((doc) => {
            request = doc.data().SendRequest
            ListF = doc.data().listfriends
          })
          setSendingRequest(request)
          setListFriends(ListF)
          request = []
          ListF = []
        })
        setIsBusy(false)
        return () => unsubscribe()
      }, [])
      */
    const searchFilterFunction = (text) => {
        if (text) {
            const newData = globalContext.masterData.filter(function (item) {
            const itemData = item.displayName ? item.displayName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
         } 
         else {
          setFilteredDataSource([]);
          setSearch(text);
        }
      };
    const ItemView = ({item}) => {
        return (
        <View style={styles.tabcontainer}>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
          <FriendsAvatar
            Img={!item.photoURL === "none" ? require('../../../PUT_Expo_Android/assets/user_no_avatar.jpg') : item.photoURL}
            Width={55}
            Height={55}
          />
          <View style={{marginLeft: 15, marginRight: 15}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
              {item.displayName}
          </Text>
          <Text>
              {item.email}
          </Text>
          </View>
          </View>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            {(typeof globalContext.sendingRequest === 'undefined') ? (
            <>
              <TouchableOpacity 
                style={[styles.sendingRequest, styles.button]}
                onPress={() => sendingMyRequest(item)}
              >
              <AntDesign name="adduser" size={25} color="white" />
              </TouchableOpacity>
            </>
            ) : 
            (<>
              {globalContext.sendingRequest.find(element => element === item.uid) ? 
                (<>
                 <TouchableOpacity 
                  style={[styles.revokeRequest, styles.button]}
                  onPress={() => revokeRequest(item)}
                  >
                  <AntDesign name="deleteuser" size={25} color="white" />
                  </TouchableOpacity>
                </>) : (
                    <>
                      {typeof globalContext.listFriends === 'undefined' ? (<></>) : (<>{globalContext.listFriends.find(element => element === item.uid) ? (<>
                        <TouchableOpacity style={[styles.textingme, styles.button]} onPress={() => {navigation.navigate('chat', {user: item})}}>
                          <AntDesign name="message1" size={25} color="white" />
                      </TouchableOpacity>
                      </>) : (<>
                        <TouchableOpacity 
                          style={[styles.sendingRequest, styles.button]}
                          onPress={() => sendingMyRequest(item)}
                        >
                          <AntDesign name="adduser" size={25} color="white" />
                          </TouchableOpacity>
                        </>)}
                    </>)}
                </>)
              }
            </>)}
          </View>
        </View>
        );
    };
    return (
    <>
        <View style={{backgroundColor: 'white', flex: 1, paddingTop: 40, paddingLeft: 10, paddingRight: 10 }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Feather name="chevron-left" size={35} color="black" />
                </TouchableOpacity>
           <SearchBar 
                ref={input}
                round={true}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                searchIcon={{ size: 24, color: 'black'}}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  width: Dimensions.get('window').width * 0.812
                }}
                inputStyle={{
                  backgroundColor:"#EEEEEE"
                }}
                inputContainerStyle={{
                  backgroundColor:"#EEEEEE"
                }}
                placeholder="Tìm kiếm"
                placeholderTextColor={"#B2B1B9"}
                value={search}></SearchBar>
            </View>
            <KeyboardAvoidingView>
            <FlatList
              data={filteredDataSource}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 85, padding: 10}}>
            </FlatList>
            </KeyboardAvoidingView>
        </View>
    </>)
}