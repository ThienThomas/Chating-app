import { collection, query, where, onSnapshot} from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { auth } from "../../firebase";
import { StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { CheckBox, SearchBar } from "react-native-elements";
import { KeyboardAvoidingView } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5,
    },
    tabcontainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
    },
    
  })
export default function CreateGroup({route, navigation}){
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([])
    const [listFriends, setListFriends] = useState([])
    const [isBusy, setIsBusy] = useState(true)
    const [search, setSearch] = useState('');
    const [checked, setChecked] = useState([])
    useEffect(() => {
        setIsBusy(true)
        const q = query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            users.push(doc.data())
          })
          setMasterDataSource(users)
          setFilteredDataSource(users)
          console.log(masterDataSource)
          console.log(checked)
        })
        setIsBusy(false)
        return () => unsubscribe()
    }, [])
    useEffect(() => {
        setIsBusy(true)
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let ListF = []
          querySnapshot.forEach((doc) => {
            ListF = doc.data().listfriends
          })
          setListFriends(ListF)
          console.log(listFriends)
          ListF = []
        })
        setIsBusy(false)
        return () => unsubscribe()
    },[])
    const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
            const itemData = item.displayName ? item.displayName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
         } 
         else {
          setFilteredDataSource(masterDataSource);
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
              <View style={{flexDirection: 'row', alignItems:'center', }}>
              <FriendsAvatar
                Img={!item.photo === "none" ? require('../../../PUT_Expo_Android/assets/user_no_avatar.jpg') : item.photoURL}
                Width={40}
                Height={40}
              />
              <View style={{marginLeft: 15, marginRight: 15}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  {item.displayName}
              </Text>
              </View>
              </View>
              <View>
                <CheckBox 
                    checkedColor="#42C2FF"
                    checked={checked.includes(item.uid)}
                    onPress={() => {
                        const newIds = [...checked];
                        const index = newIds.indexOf(item.uid);
                        if (index > -1) {
                            newIds.splice(index, 1);
                            console.log(newIds)
                        }
                        else {
                            newIds.push(item.uid)
                            console.log(newIds)
                        }
                        setChecked(newIds)
                    }}
                >
                </CheckBox>
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
              data={filteredDataSource}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 85, padding: 10,}}
          >
          </FlatList>
          </KeyboardAvoidingView>
        </View>
    )
}