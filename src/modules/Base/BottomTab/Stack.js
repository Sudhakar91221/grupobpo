import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import Login from '../../AuthModule/Screens/Login';
import Splash from '../../AuthModule/Screens/Splash';
// import Landing from '../AuthModule/Screens/Landing';
import BottomTab from './BottomTab';
import Register from '../../AuthModule/Screens/Register';
import SetPassword from '../../AuthModule/Screens/SetPassword';
import ForgotPassword from '../../AuthModule/Screens/ForgotPassword';
import ImageViewer from '../../../components/external/ImageViewer';
import VideoPlayer from '../../../components/external/VideoPlayer';
import OTPScreen from '../../AuthModule/Screens/OTPScreen';
import AnotherScreen from '../../FormsComponent//Component/AnotherScreen';
import InputForm from '../../FormsComponent/Forms/InputForm';
import CountryList from '../../FormsComponent/Component/Phone/CountryList';
import {DrawerNavigator} from '../Drawer/Drawer';

const DashboardStack = createStackNavigator(
  {
    Splash: {screen: Splash},
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
    navigationOptions: {
      header: null,
    },
  },
);

const AuthStack = createStackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
    CountryList: {
      screen: CountryList,
    },
    Register: {
      screen: Register,
      navigationOptions: {
        title: 'Register Account',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 13,
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    OTPScreen: {
      screen: OTPScreen,
      navigationOptions: {
        title: 'Verify OTP',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 13,
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        title: 'Forgot Password',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 13,
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    SetPassword: {
      screen: SetPassword,
      navigationOptions: {
        title: 'Set Password',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 13,
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    ImageViewer: {
      screen: ImageViewer,
      navigationOptions: {
        header: null,
        headerTiitleStyle: {
          paddingTop: 13,
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    VideoPlayer: {
      screen: VideoPlayer,
      navigationOptions: {
        header: null,
        headerTitleStyle: {
          paddingTop: 13,
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    InputForm: {
      screen: InputForm,
    },
    AnotherScreen: {
      screen: AnotherScreen,
    },
  },
  {
    initialRouteName: 'Splash',
    //  headerMode:'none',
    //  navigationOptions: {
    //    header: null,
    //  },
  },
);

const DrawerAndBottomStack = createStackNavigator(
  {
    //BottomTab: BottomTab,
    Drawer: DrawerNavigator,
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none',
    // navigationOptions: {
    //   header: null,
    // },
  },
);

export const AppStack = DrawerAndBottomStack;

const AuthAppSwitch = createAnimatedSwitchNavigator(
  {
    AuthStack: AuthStack,
    AppStack: AppStack,
  },
  {
    initialRouteName: 'AuthStack',
    transition: (
      <Transition.Together>
        <Transition.Out type="fade" durationMs={400} interpolation="easeIn" />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  },
);

export {AuthStack, AuthAppSwitch, DashboardStack};
