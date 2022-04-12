import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AnimatedLottieView from "lottie-react-native";
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 10
    }
})
export const AppLoadingAnimation = ({mess}) => {
    return (
            <View style={[StyleSheet.absoluteFill, styles.container]}>
                <AnimatedLottieView source={require('../assets/json/loading.json')} autoPlay loop />
            </View>

    )
}

