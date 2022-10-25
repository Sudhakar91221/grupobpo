import React, {Component} from 'react';
import { View } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { withTheme } from './themeProvider';

class Gradient extends Component {
  // ///DE506E
  
  render() {
    const {theme} = this.props

    return (
      
      <View>
      <LinearGradient
        colors={[theme.startColor, theme.endColor1]}
        style={this.props.style}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        // locations={[0, 0.7, 0.9]}
      >

{this.props.children}

      </LinearGradient>
      
      </View>
      
      )
    }
    
    
  }

  export default withTheme(Gradient);

//   <LinearGradient
//   colors={[theme.startColor, theme.endColor]}
//   style={{ flex: 1 }}
//   start={{x: 0, y: 0}}
//   end={{x: 1, y: 0}}
// >