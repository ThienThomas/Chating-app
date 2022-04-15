import React, {useState, useEffect, useContext} from "react";
import { View, Text} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../elements/FriendsAvatar";
import GlobalContext from "../context/ConText";
import { UseGlobalContext } from "../GlobalContext";
import { getFirestore } from 'firebase/firestore';
import { collection, onSnapshot, query, where} from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import { Dimensions } from "react-native";
import { Feather, FontAwesome} from '@expo/vector-icons';

export default function Chats(){
  return (
    <UseGlobalContext>
      <ListChats></ListChats>
    </UseGlobalContext>
  )
}
function ListChats(){
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [listFriends, setListFriends] = useState([])
    const [isBusy, setIsBusy] = useState(true)
    const globalContext = useContext(GlobalContext);
    const navigation = useNavigation()
    useEffect(() => {
       setIsBusy(true)
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let listF = [];
          querySnapshot.forEach((doc) => {
            listF = doc.data().listfriends
          })
          setListFriends(listF)
          console.log(listFriends)
        })
        const q1 = query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid))
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            users.push(doc.data())
          })
          setMasterDataSource(users)
          setFilteredDataSource(users)
          console.log(masterDataSource)
          console.log(filteredDataSource)
        })
        setIsBusy(false)
      }, []);
    
      const searchFilterFunction = (text) => {
        if (text) {
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.displayName ? item.displayName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          setFilteredDataSource(masterDataSource);
          setSearch(text);
        }
      };
    const ItemView = ({item}) => {
        return (
        <>
        {isBusy === false && typeof listFriends === 'undefined' ? (<>
          <View></View>
        </>) : (<>
          {listFriends.find(element => element === item.uid) ? (<>
            <TouchableOpacity onPress={() => {navigation.navigate('chat', {user: item})}}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15
            }}>
              <FriendsAvatar
                Img={item.photoURL}
                Width={55}
                Height={55}
              />
              <View style={{marginLeft: 15}}>
              <Text  style={{fontWeight: 'bold', fontSize: 18}}>
                  {item.displayName}
              </Text>
              <Text style={{color: 'grey'}}>Bạn: 😆😆😆 &bull;	Thứ 3, 12:01</Text>
              </View>
              <View  style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: Dimensions.get('window').width * 0.45
              }}>
              
              </View>
            </View>
            </TouchableOpacity>
          </>) : (<></>)}
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
                    borderBottomWidth: 0
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
            <FlatList
                data={filteredDataSource}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}  
                showsHorizontalScrollIndicator={false}  
                showsVerticalScrollIndicator={false}
                style={{marginBottom: 85, padding: 10}}
            >
            </FlatList>
        </View>
        {!globalContext.isPending ?  null : <AppLoadingAnimation />}
        </>
    )
}