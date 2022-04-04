import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'react-native';
import { Dimensions } from "react-native";
import { Asset, useAssets } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function TextGradient({text, fontS, fontW}){
    return (
            <MaskedView 
            maskElement={<Text
                    style={{
                        backgroundColor: "transparent",
                        fontSize: fontS,
                        fontWeight: fontW,
                    }}
                >
                    {text}
                </Text>}>
                <LinearGradient
                start={{x: 0, y: 0}}
                end={{x:1, y:1}}
                colors={["#2800FF", "#08F19D"]}
                >
                <Text
                    style={{
                        opacity: 0,
                        fontSize: fontS,
                        fontWeight: fontW,
                    }}
                >
                    {text}
                </Text> 
            </LinearGradient>   
        </MaskedView>
    )
}