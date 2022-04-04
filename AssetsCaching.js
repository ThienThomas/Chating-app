import * as React from 'react';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Image } from 'react-native';
function cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }
export async function _loadAssetsAsync(images){
    const imageAssests = cacheImages(images);
    await Promise.all([...imageAssests]);
}