import React from 'react';
import { View, StatusBar } from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const CustomStatusBar = ({ backgroundColor, ...props }) => (
            <View style={[styles.statusBar, { backgroundColor }]}>
                 <StatusBar translucent backgroundColor={backgroundColor} {...props} />
            </View>
);

export default CustomStatusBar;

const styles = {
        statusBar: {
            height: STATUSBAR_HEIGHT
        }
}