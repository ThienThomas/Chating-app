import React, {useState, useEffect, useContext} from "react";
import { View, Text, Dimensions} from "react-native";
import { SearchBar } from "react-native-elements";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import GlobalContext from "../../context/ConText";
import { auth } from "../../firebase";
import { StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { collection, onSnapshot, query, where} from "firebase/firestore";
import { db } from "../../firebase";
import { KeyboardAvoidingView } from "react-native";
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
export default function AllFriends({masterData}){
    const [search, setSearch] = useState('');
    const [listFriends, setListFriends] = useState([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [isBusy, setIsBusy] = useState(true)
    const globalContext = useContext(GlobalContext);
    const navigation = useNavigation()
    useEffect(() => {
      setIsBusy(true)
        const q2 = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
          let ListF = []
          querySnapshot.forEach((doc) => {
            ListF = doc.data().listfriends
          })
          setListFriends(ListF)
          console.log(listFriends)
          ListF = []
        })
        setIsBusy(false)
      }, []);
      const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterData.filter(function (item) {
            const itemData = item.email ? item.email.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
         } 
         else {
          setFilteredDataSource(masterData);
          setSearch(text);
        }
      };
   
    const ItemView = ({item}) => {
        return (
            <>
            {isBusy === true ? (
            <></>) : (<>
            {typeof listFriends === 'undefined' ? (<></>) : (<>
            {listFriends.find(element => element === item.uid) ? (<>
              <View style={styles.tabcontainer}>
              <View style={{flexDirection: 'row', alignItems:'center'}}>
              <FriendsAvatar
                Img={!item.photo === "none" ? require('../../../PUT_Expo_Android/assets/user_no_avatar.jpg') : item.photoURL}
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
              <View>
              <TouchableOpacity style={[styles.textingme, styles.button]} onPress={() => {navigation.navigate('chat', {user: item})}}>
                <AntDesign name="message1" size={25} color="white" />
                </TouchableOpacity>
              </View>
              </View>
            </>) : (<></>)}
            </>)}</>)} 
            </>
        );
    };
    return (
        <View style={styles.container}>
              <SearchBar 
              round={true}
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
          <KeyboardAvoidingView>
          <FlatList
              data={masterData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 85, padding: 10}}
          >
          </FlatList>
          </KeyboardAvoidingView>
        </View>
    )
  }