import { StatusBar } from 'expo-status-bar';
import React, {Children, useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { useAssets } from "expo-asset";
import { onAuthStateChanged} from "firebase/auth"
import { auth } from "./firebase"
import { NavigationContainer, useNavigation} from "@react-navigation/native"
import { createStackNavigator}  from "@react-navigation/stack"
import SignIn from "./screens/SignIn"
import ContextWrapper from './context/ConTextWrapper';
import "react-native-gesture-handler";
import { async } from '@firebase/util';
import AppLoading from 'expo-app-loading';
import { render } from 'react-dom';
import Context from './context/ConText';
import Settings from './screens/Settings';
import Profile from './screens/Profile'
import Splash from './screens/Splash'
import TextGradient from './elements/TextGradient';
import Intro from './screens/Intro';
import Forgot from './screens/Forgot'
import Chats from './screens/Chats'
import Friends from './screens/Friends';
import Call from './screens/Call';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign, Feather,Entypo } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Avatar from './elements/Avatar';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import BottomTabNavigatorElement from './elements/BottomTabbarElements';
import Chat from './screens/Chat';
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage ...."
])
import UserInfo from './screens/UserInfo';
import PointPropType from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedPointPropType';
import ChangeInfo from './screens/Settings';
import FriendsAvatar from './elements/FriendsAvatar';
import Voice from './screens/VoiceCall';
import VoiceCall from './screens/VoiceCall';
import VideoChat from './screens/VideoChat';
function App() {
  const [currUser, setCurrUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false);
      if (user) {
        setCurrUser(user);
      }
      else {
        setCurrUser(null);
      }
    });
    return () => unsubscribe;
  }, []);
  if (loading) {
    return (
      <View style={{
        justifyContent: "center", 
        alignItems: "center", 
        flex: 1, 
        backgroundColor: "white"}
        }>
         <Image 
            source={require('./assets/welcome-img.png')}
            style={{width: Dimensions.get('window').width * 0.55, height: Dimensions.get('window').width * 0.55}}
            resizeMethod="auto"
             />
      </View>
    )
  }
  return (
    <NavigationContainer>
    <StatusBar style='transparent'></StatusBar>
    <Stack.Navigator screenOptions={{headerStyle: {
        backgroundColor: 'white',
        shadowOpacity: 0,
        elevation: 0}, 
        headerTintColor: 'white',
      }
    }
      >
    {!currUser ? (
      <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name='intro' component={Intro}/>
          <Stack.Screen name='signIn' component={SignIn} />
          <Stack.Screen name='forgot' component={Forgot} />
      </Stack.Group>
    ) : (
        <>
        <Stack.Group>
        {!currUser.displayName && (
          <Stack.Screen 
            name='profile' 
            component={Profile} 
            options={{headerShown: false, title: "Profile"}}
            />
            )}
            <Stack.Screen 
            name='home' 
            component={Home} 
            options={{headerShown: false, title: "home"}}
            />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'} }}> 
              <Stack.Screen 
                name="userinfo" 
                component={UserInfo} 
                />
            </Stack.Group>
            <Stack.Group>
            <Stack.Screen screenOptions={{presentation: 'modal',  headerTitleStyle:{color: 'transparent'}, }}
                  name='settings'
                  component={Settings} 
                  options={{
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                                      headerBackTitleVisible: true,
                  headerBackTitleStyle: {
                    color: 'black'
                  },
                  headerBackImage: () => {""},
                  }}
                 />
            </Stack.Group>
            <Stack.Group>
            <Stack.Screen screenOptions={{presentation: 'modal'}}
                name="chat" 
                component={Chat} 
                options={({route, navigation}) => ({
                  headerBackTitle: <>
                    <Feather name="chevron-left" size={35} color="#42C2FF" />
                  </>,
                  headerLeftLabelVisible: true,
                  headerLeftContainerStyle: {
                    width: 50
                  },
                  headerTitle: () => (
                    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',}}>
                    <FriendsAvatar
                        Img={!route.params.user.photoURL === "none" ? require('./assets/user_no_avatar.jpg') : route.params.user.photoURL}
                        Width={40}
                        Height={40} 
                    />
                    <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, }}>{route.params.user.displayName}</Text>
                    </TouchableOpacity>
                   ),
                  headerTitleContainerStyle: {
                    marginLeft: 0
                  },
                  headerBackTitleVisible: true,
                  headerBackImage: () => (<></>),
                  headerRight: () => (
                    <View style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 10}} onPress={ () => { navigation.navigate('voicecall', {user:route.params.user}) }}>
                        <FontAwesome name="phone" size={26} color="#42C2FF" />
                      </TouchableOpacity >
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 10}} onPress={ () => { navigation.navigate('videochat', {user:route.params.user}) }}>
                        <FontAwesome name="video-camera" size={26} color="#42C2FF" />                      
                        </TouchableOpacity >
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 15}}>
                      <MaterialIcons name="settings" size={26} color="#42C2FF" />
                        </TouchableOpacity>
                     </View>
                    ),
                  })}
                />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal', headerShown : false}}>
              <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
                name="voicecall" 
                component={VoiceCall} 
              />
              <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
                name="videochat" 
                component={VideoChat} 
              />
            </Stack.Group>
            </>
      )  
    }
    </Stack.Navigator>
  </NavigationContainer>
  );
}
function Home(){
  const navigation = useNavigation();
  return (
      <Tab.Navigator
          screenOptions={{
            headerBackgroundContainerStyle: () => {
              return (
              <View style={{backgroundColor: 'orange'}}>
              </View>
              )
            },
            headerStyle: {
              height: 100,
            },
            headerTitleStyle:{
              color: 'black',
              fontSize: 25
            },
            tabBarShowLabel: false,
            tabBarStyle: {
              position: 'absolute',
              bottom: 15,
              marginLeft: 15,
              marginRight: 15,
              backgroundColor: "white",
              borderRadius: 20,
              height: 80
            },
            headerLeft: props => (
              <TouchableOpacity onPress={() => {navigation.navigate('userinfo')}} style={{marginLeft: 15}}>
                <Avatar />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginRight: 15}}>
                <MaterialIcons name="groups" size={35} color="#42C2FF" />
              </TouchableOpacity>
            )
            
        }
      }
      >
        <Tab.Screen 
            name="Đoạn chat" 
            component={Chats} 
            options={{ 
              tabBarIcon: ({focused}) => (
                  <BottomTabNavigatorElement 
                    name="message-circle"
                    focused={focused}
                    text='Đoạn chat'/>)
             }}
            />
          <Tab.Screen 
            name="Cuộc gọi" 
            component={Call} 
            options={{ 
              tabBarIcon: ({focused}) => (
                  <BottomTabNavigatorElement 
                    name="phone"
                    focused={focused}
                    text='Cuộc gọi'/>)}}            
            />
          <Tab.Screen 
            name="Bạn bè" 
            component={Friends} 
            options={{ 
              tabBarIcon: ({focused}) => (
                  <BottomTabNavigatorElement 
                    name="users"
                    focused={focused}
                    text='Bạn bè'/>)}} 
            />
            
      </Tab.Navigator>
  )
}
export default class Main extends React.Component{
  state = {
    isReady: false
  }

  render(){
    if (!this.state.isReady){
        return <AppLoading
                startAsync={this._loadingRresources}
                onFinish={() => this.setState({isReady : true})}
                onError={console.warn}>
              <Text>Hii</Text>
            </AppLoading>
    }

    return (
      <ContextWrapper>
        <App/>
      </ContextWrapper>
    ) ;
  } 
  async _loadingRresources() {
    

  }
}

