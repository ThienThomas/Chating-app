import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Foundation, FontAwesome5, Fontisto } from '@expo/vector-icons';
import TextGradient from '../../elements/TextGradient';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const styles = StyleSheet.create({
    slides: {
        flex: 1, 
        backgroundColor: 'white',
    },
    slideview: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        width: Dimensions.get('window').width * 1
    },
    slideimg:{
        width: Dimensions.get('window').width * 0.55, 
        height: Dimensions.get('window').width * 0.55
    },
    icon:{

        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
      },
});
const slides = [
    {
      key: '1',
      title: 'Nhắn tin',
      text: 'Description.\nSay something cool',
      image: require('../../assets/welcome-img.png'),
      backgroundColor: '#59b2ab',
      icon: <View style={styles.icon}><Entypo name="message" size={175} color='' /></View>,
      icon2: <View><Entypo name="message" size={175} style={{ opacity: 0 }}/></View>
    },
    {
      key: '2',
      title: 'Gọi điện',
      text: 'Other cool stuff',
      image: require('../../assets/welcome-img.png'),
      backgroundColor: '#febe29',
      icon: <View style={styles.icon}><Entypo name="phone" size={175} color='' /></View>,
      icon2: <View><Entypo name="phone" size={175} style={{ opacity: 0 }}/></View>
    },
    {
      key: '3',
      title: 'Chia sẻ',
      text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
      image: require('../../assets/welcome-img.png'),
      backgroundColor: '#22bcb5',
      icon: <View style={styles.icon}><Entypo name="share" size={175} color=''  /></View>,
      icon2: <View><Entypo name="share" size={175} style={{ opacity: 0 }}/></View>
    }
  ];
export default class Intro extends React.Component {
    constructor(){
        super();
    }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slideview}>
        <MaskedView 
           style={{
               justifyContent: "center",
               marginBottom: 25,
               alignItems: "center",
            }}
            maskElement={item.icon}
                >
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x:1, y:1}}
                    colors={["#2800FF", "#08F19D"]}
                >
                {item.icon2}
            </LinearGradient>    
        </MaskedView>
        <TextGradient text={item.title} fontS={24} fontW="bold"/>
      </View>
    );
  }
  _onDone = () => {
      const navigation = this.props.navigation;
      navigation.replace("signIn")
  }
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Entypo name="check" size={24} color="black" />
      </View>
    );
  };
  _renderSkipButton = () => {
    return (
      <View >
        <Text>Bỏ qua</Text>
      </View>
    );
  };
  render() {
      return (
      <View style={styles.slides}>
        <AppIntroSlider 
        renderItem={this._renderItem} 
        data={slides} 
        onDone={this._onDone}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        showSkipButton={true}
        renderSkipButton={this._renderDoneButton}
        onSkip={this._onDone}
        />
      </View>
      )
  }
}