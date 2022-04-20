import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'react-native';
import { Dimensions } from "react-native";
import { Asset, useAssets } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import TextGradient from '../../elements/TextGradient';
export default function Splash({navigation}){
    const [assets, error] = useAssets([require('../../assets/welcome-img.png')])
    setTimeout(()=>{
       navigation.replace('intro');
    }, 2000)
    const ctext = 'Exping'
    return (
        <View style={{
            justifyContent: "center", 
            alignItems: "center", 
            flex: 1, 
            backgroundColor: "white"}
            }>
                { assets ? 
                    <Image 
                        source={assets[0]}
                        style={{width: Dimensions.get('window').width * 0.55, height: Dimensions.get('window').width * 0.55}}
                        resizeMethod="auto"
                    /> :  
                    <TextGradient text={ctext} fontS={40} fontW={'500'}/>     
            }
        </View>
    )
}
