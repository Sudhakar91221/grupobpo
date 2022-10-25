import {Platform,  Dimensions } from 'react-native';


const Screen = Dimensions.get('window');
const ScreenWidth = Screen.width;
const ScreenHeight = Screen.height;
const isIOS = Platform.OS === 'ios';




export {
     ScreenWidth,
     ScreenHeight,
     isIOS
}