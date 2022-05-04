import { View, Text, Image, ImageBackground , TouchableOpacity, StyleSheet} from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome, Entypo, Feather } from '@expo/vector-icons';
import FriendsAvatar from '../../elements/FriendsAvatar'
import { Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native';
const styles = StyleSheet.create({
  lineargradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
      borderBottomRightRadius: 25,
      borderBottomLeftRadius: 25,
  },
  icon: {
      margin: 7.5,
  },
  icon_opa: {
      borderRadius: 100,
      padding: 15,
  },
  speaker: {
      backgroundColor: "#d1d1d1",
  },
  close: {
      backgroundColor: "#FF5757",
  },
  backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // or 'stretch'
  }
})
export default function MakingVideoCall({route}) {
  const navigation = useNavigation()
  const user = route.params.user
  console.log(user)
  return (
    <>
    <View  style={{flex: 1, backgroundColor: "white", justifyContent:'center', alignItems: 'center',}}>
       <FriendsAvatar Img={!user.photoURL === "none" ? require('../../assets/user_no_avatar.jpg') : user.photoURL}
              Width={150}
              Height={150}></FriendsAvatar>
          <Text style={{fontWeight: 'bold', fontSize: 35, marginTop: 25}}>{user.displayName}</Text>
          <Text style={{ marginTop: 10}}>Đang gọi...</Text>
          
      </View>
      <View style={{flexDirection: 'row', bottom: 0, backgroundColor: 'white', justifyContent: 'center', alignContent: 'center', paddingBottom: 10, paddingTop: 10}} >
        <TouchableOpacity style={styles.icon} onPress={() => {navigation.navigate('videochat')}}>
          <AntDesign name="close" size={35} color="white"  style={[styles.close, styles.icon_opa]} />
        </TouchableOpacity>
    </View>
  </>
  )
}