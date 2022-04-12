import React, {useState, useEffect, useContext} from "react";
import { View, Text, Dimensions} from "react-native";
import { SearchBar } from "react-native-elements";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../elements/FriendsAvatar";
import GlobalContext from "../context/ConText";
import { auth } from "../firebase";
import { StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { collection, onSnapshot, query, where} from "firebase/firestore";
import { db } from "../firebase";
import { sendingRequest, revokeRequest} from "../mymodules/FriendsTabProcessing";
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5
    },
    tabcontainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
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
    const [sendRequest, setSendRequest] = useState([])
    const [listFriends, setListFriends] = useState([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [isBusy, setIsBusy] = useState(true)
    const [viewMode, setViewMode] = useState(true);
    const globalContext = useContext(GlobalContext);
    useEffect(() => {
      setIsBusy(true)
        const q1 = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          let SendRequest = []
          querySnapshot.forEach((doc) => {
            SendRequest = doc.data().SendRequest
          })
          setSendRequest(SendRequest)
          //console.log(sendRequest)
          SendRequest = []
        })
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
          setFilteredDataSource([]);
          setSearch(text);
        }
      };
    const ItemViewdefault = ({item}) => {
      return (
        <>
        {(isBusy === false && typeof listFriends === 'undefined') ? (<></>) : (<>
        {listFriends.find(element => element === item.uid) ? (<>
                    <View style={styles.tabcontainer}>
                        <FriendsAvatar
                            Img={!item.photo === "none" ? require('../assets/user_no_avatar.jpg') : item.photoURL}
                            Width={55}
                            Height={55}
                        />
                        <View style={{marginLeft: 15, marginRight: 15, width: Dimensions.get('window').width * 0.55}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>
                            {item.displayName}
                        </Text>
                        <Text>
                            {item.email}
                        </Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity style={[styles.textingme, styles.button]}>
                            <AntDesign name="message1" size={25} color="white" />
                        </TouchableOpacity>
                        </View>
                        </View>
                    </>) : (<></>)}
                </>)}
        </>
        );
    }
    const ItemView = ({item}) => {
        return (
        <View style={styles.tabcontainer}>
          <FriendsAvatar
            Img={!item.photo === "none" ? require('../assets/user_no_avatar.jpg') : item.photoURL}
            Width={55}
            Height={55}
          />
          <View style={{marginLeft: 15, marginRight: 15, width: Dimensions.get('window').width * 0.55}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
              {item.displayName}
          </Text>
          <Text>
              {item.email}
          </Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            {(isBusy === false && typeof sendRequest === 'undefined') ? (
            <>
              <TouchableOpacity 
                  style={[styles.sendingRequest, styles.button]}
                  onPress={() => sendingRequest(item)}
              >
              <AntDesign name="adduser" size={25} color="white" />
              </TouchableOpacity>
            </>
            ) : 
            (<>
              {sendRequest.find(element => element === item.uid) ? 
                (<>
                 <TouchableOpacity 
                  style={[styles.revokeRequest, styles.button]}
                  onPress={() => revokeRequest(item)}
                  >
                  <AntDesign name="deleteuser" size={25} color="white" />
                  </TouchableOpacity>
                </>) : (
                    <>
                        {typeof listFriends === 'undefined' ? (<></>) : (<>{listFriends.find(element => element === item.uid) ? (<>
                            <TouchableOpacity style={[styles.textingme, styles.button]}>
                                <AntDesign name="message1" size={25} color="white" />
                            </TouchableOpacity>
                        </>) : (<>
                            <TouchableOpacity 
                                style={[styles.sendingRequest, styles.button]}
                                onPress={() => sendingRequest(item)}
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
          <View style={styles.container}>
              <SearchBar 
              onFocus={() => {setViewMode(false)}}
              onBlur={() => {setViewMode(true)}}
              onre
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
              data={!viewMode ?  filteredDataSource : masterData }
              keyExtractor={(item, index) => index.toString()}
              renderItem={!viewMode ? ItemView : ItemViewdefault}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 85, padding: 10}}
          >
          </FlatList>
      </View>
    )
  }