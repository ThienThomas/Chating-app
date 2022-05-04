import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function ChatInfo({route}) {
  const user = route.params.user
  const navigation = useNavigation()
  console.log(user)
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{alignItems:'center'}}>
            <Image 
                source={user.photoURL !== "none"? {uri: user.photoURL, cache: 'force-cache'} : require('../../assets/user_no_avatar.jpg')}
                style={{
                        width: 125, 
                        height: 125,
                        borderRadius: 200
                    }}
                    resizeMethod="auto">
            </Image>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 10}}>
                {user.displayName}
            </Text>
        </View>
        <View style={{margin: 20}}> 
        <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>HÀNH ĐỘNG KHÁC</Text>
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}} onPress={() => {navigation.navigate('friendinfo', {user: user})}} >
                <Text style={{fontSize: 17}}>Xem trang cá nhân của {user.displayName}</Text>
                <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                    <Ionicons  name="information" size={20} color="black" />
                </View>
           </TouchableOpacity>
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}} onPress={() => {navigation.navigate('sharing', {user: user})}}>
                <Text style={{fontSize: 17}}>Xem phương tiện và file đã chia sẻ</Text>
                <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                    <Ionicons  name="image" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 17}}>Tìm kiếm trong cuộc trò chuyện</Text>
                <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                    <Ionicons  name="search" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 17}}>Thông báo và âm thanh</Text>
                <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                    <Ionicons  name="notifications" size={20} color="black" />
                </View>
            </TouchableOpacity>
            
        </View>
        <View style={{margin: 20}}> 
        <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>QUYỀN RIÊNG TƯ</Text>

            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 17}}>Chặn {user.displayName}</Text>
                <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                    <Entypo name="block" size={20} color="black" />
                </View>
            </TouchableOpacity>
        </View>    
    </View>
  )
}