import { StatusBar } from 'expo-status-bar';
import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { useAssets } from "expo-asset";
import { onAuthStateChanged} from "firebase/auth"
import { auth } from "./firebase"
import { NavigationContainer} from "@react-navigation/native"
import { createStackNavigator}  from "@react-navigation/stack"
import SignIn from "./screens/SignIn"
import ContextWrapper from './context/ConTextWrapper';
import "react-native-gesture-handler";
import { async } from '@firebase/util';
import AppLoading from 'expo-app-loading';
import { render } from 'react-dom';
import Context from './context/ConText';
import Profile from './screens/Profile'
LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage ...."
])
const Stack = createStackNavigator()
function App() {
  const [currUser, setCurrUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false);
      if (user) {
        setCurrUser(user);
      }
    });
    return () => unsubscribe;
  }, []);
  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <NavigationContainer>
      {!currUser ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='signIn' component={SignIn} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerStyle: {
          backgroundColor: 'white',
          shadowOpacity: 0,
          elevation: 0
        }, 
          headerTintColor: 'white',
        }}>
          {!currUser.displayName &&
            <Stack.Screen 
              name='profile' 
              component={Profile} 
              options={{headerShown: false, title: "Profile"}}
              />
          }
          <Stack.Screen 
            name="home"
            options={{title: "Chats"}} 
            component={Home}
          />
        </Stack.Navigator>
        )  
      }
    </NavigationContainer>
  );
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
                onError={console.warn}
              >
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
    assets = useAssets(
      require("./assets/icon-square.png"), 
      require("./assets/chatbg.png"),
      require("./assets/user-icon.png"),
      require("./assets/welcome-img.png")
    )
  }
}

function Home(){
  return <Text>Hi I have a profile </Text>
}