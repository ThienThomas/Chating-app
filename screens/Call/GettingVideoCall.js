import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { auth } from '../../firebase'
import { AntDesign, FontAwesome, Entypo, Feather } from '@expo/vector-icons';

import { StyleSheet } from 'react-native'
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
      backgroundColor: "green",
  },
  backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // or 'stretch'
  }
})
export default function GettingVideoCall({hangup, join}) {
  return (
    <>
    <View style={{flex: 1, backgroundColor: "white", justifyContent:'center', alignItems: 'center',}}>
      <ImageBackground  source={{uri: 'https://cafebitcoin.net/wp-content/uploads/2021/12/shiba-inu-g755c9056b_1280.jpg', cache: 'force-cache'}} style={{width: "100%", height: "100%", flex: 1}} >
        <View style={{alignSelf:'center', position: 'absolute',flexDirection: 'row', bottom: 0, backgroundColor: 'transparent', justifyContent: 'center', alignContent: 'center', paddingBottom: 10, paddingTop: 10}} >
          <TouchableOpacity style={[styles.icon, {marginRight: 35}]} onPress={hangup}>
            <Feather name="phone-call" size={35} color="white" style={[styles.close, styles.icon_opa]}  />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.icon, {marginLeft: 35}]} onPress={join}>
            <AntDesign name="close" size={35} color="white"  style={[{backgroundColor: "#FF5757"}, styles.icon_opa]} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
         
    </View>

    </>
  )
}