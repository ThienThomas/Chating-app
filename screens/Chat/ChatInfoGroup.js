import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function ChatInfoGroup({route}) {
  const group_item = route.params.group_item
  const navigation = useNavigation()
  //console.log(user)
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{alignItems:'center'}}>
            <Image 
                source={group_item.avatar !== "none"? {uri: group_item.avatar, cache: 'force-cache'} : require('../../assets/user_no_avatar.jpg')}
                style={{
                        width: 125, 
                        height: 125,
                        borderRadius: 200
                    }}
                    resizeMethod="auto">
            </Image>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 10}}>
                {group_item.name}
            </Text>
        </View>
        <View style={{margin: 20}}> 
        <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>HÀNH ĐỘNG KHÁC</Text>
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}  >
                <Text style={{fontSize: 17}}>Xem thành viên nhóm</Text>
                <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                    <Ionicons  name="information" size={20} color="black" />
                </View>
           </TouchableOpacity>
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}} onPress={() => {navigation.navigate('sharinggroup', {group_item: group_item})}}>
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
                <Text style={{fontSize: 17}}>Rời khỏi nhóm</Text>
                <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                    <Entypo name="block" size={20} color="black" />
                </View>
            </TouchableOpacity>
        </View>    
    </View>
  )
}