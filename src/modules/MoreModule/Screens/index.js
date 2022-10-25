import {createStackNavigator} from 'react-navigation-stack';
import MoreList from './MoreList';
import ChangePassword from './ChangePassword';
import WebviewScreen from './WebviewScreen';
import Profile from '../../AuthModule/Screens/Profile';
import Logout from '../../AuthModule/Screens/Logout';
import CountryList from '../../FormsComponent/Component/Phone/CountryList';
import ImageViewer from '../../../components/external/ImageViewer';
import FAQScreen from './FAQScreen';
import AppFeedback from './AppFeedback';
import AnotherScreen from '../../FormsComponent/Component/AnotherScreen';
import PreviewSummary from '../../FormsComponent/Forms/PreviewSummary';
import SuccessForm from '../../FormsComponent/Forms/SuccessForm';
import Profile1 from '../../AuthModule/Screens/Profile1';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const MoreStack = createStackNavigator(
  {
    More: {
      screen: MoreList,
      navigationOptions: {
        title: 'More',
      
      },
    },
  
 
    AnotherScreen: {
      screen: AnotherScreen,
    },
    PreviewSummary: {
      screen: PreviewSummary,
    },
    SuccessForm: {
      screen: SuccessForm,
    },
    CountryList: {
      screen: CountryList,
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        title: 'Change Password',
        
      },
    },
    WebviewScreen: {
      screen: WebviewScreen,
    },
    Profile: {
      screen: Profile1,
      navigationOptions: {
        title: 'Account Settings',
       
      },
    },
    ImageViewer: {
      screen: ImageViewer,
      navigationOptions: {
        title: 'View Image',
       
      },
    },
    FAQScreen: {
      screen: FAQScreen,
    },
    AppFeedback: {
      screen: AppFeedback,
    },

    
    Logout: {screen: Logout},
  },
  {
    initialRouteName: 'More',
    defaultNavigationOptions: ({ screenProps }) => {
      return {
        headerBackground: (
          <LinearGradient
            colors={['#10356c', '#474F6A']}
            style={{ flex: 1 }}
            // start={{x: 0, y: 0}}
             end={{x: 1, y: 0}}

            start={{x: 0.0, y: 0.0}}
        // end={{x: 1.0, y: 1.0}}
        locations={[0.1, 0.9]}
          />
        ),
        headerStyle: {
          backgroundColor: screenProps.theme.backgroundColor,
        },
        headerTintColor: screenProps.theme.navBarHeaderColor,
        headerTitleStyle: {
          color: screenProps.theme.navBarHeaderColor,
          fontSize: 22,
          fontWeight: 'bold',
            // textAlign: 'left',
            // alignSelf: 'flex-start',
            // flex: 1,
            // paddingRight: 0,
            // fontSize: 26,
            // color: 'white',
            // marginTop: 10,
         
        }
      };
    },
  },
);

MoreStack.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'More') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
  };
};

export default MoreStack;
