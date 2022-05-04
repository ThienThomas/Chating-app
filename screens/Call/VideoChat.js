import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome, Entypo, Feather } from '@expo/vector-icons';

import { MediaStream, RTCView } from 'react-native-webrtc'
const styles = StyleSheet.create({
    bContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
      margin: 7.5,
      bottom: 0
    },
    icon_opa: {
        borderRadius: 100,
        padding: 15,
    },
    video: {
      position: 'absolute',
      width: "100%",
      height: "100%"
    },
    videoLocal: {
      position: 'absolute',
      width: 100,
      height: 150,
      top: 0,
      left: 20,
      elevation: 10
    }
})/*
let localStream = MediaStream | null;
let remoteStream = MediaStream | null;
*/
export default function VideoChat({localStream, remoteStream, hangup}) {
  if (localStream && !remoteStream) {
    return (
      <View style={styles.bContainer}>
        <RTCView
          streamURL={localStream.toURL()}
          objectFit="cover"
          style={styles.video} 
        >
        </RTCView>
        <View style={styles.bContainer}>
          <TouchableOpacity style={[styles.icon]} onPress={hangup}>
            <AntDesign name="close" size={35} color="white"  style={[{backgroundColor: "#FF5757"}, styles.icon_opa]} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  if (localStream && remoteStream) {
    return (
      <View style={styles.bContainer}>
        <RTCView
          streamURL={remoteStream.toURL()}
          objectFit="cover"
          style={styles.video} 
        >
        </RTCView>
        <RTCView
          streamURL={localStream.toURL()}
          objectFit="cover"
          style={styles.videoLocal} 
        >
        </RTCView>
        <View style={styles.bContainer}>
          <TouchableOpacity style={[styles.icon]}  onPress={hangup}>
            <AntDesign name="close" size={35} color="white"  style={[{backgroundColor: "#FF5757"}, styles.icon_opa]} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  return (
    <View style={styles.bContainer}>
      <TouchableOpacity style={[styles.icon]}  onPress={hangup}>
        <AntDesign name="close" size={35} color="white"  style={[{backgroundColor: "#FF5757"}, styles.icon_opa]} />
      </TouchableOpacity>
    </View>
  )
}