import {createStackNavigator} from 'react-navigation-stack';
import MemberScreen from './MemberScreen';
import MemberFilter from './MemberFilter';
import AddMember from './AddMember';
import CountryList from '../../FormsComponent/Component/Phone/CountryList';
import UsersList from './UsersList';
import EditMember from './EditMemberPager';
import DesignationList from './DesignationList';
import DepartmentList from './DepartmentList';
import ImageViewer from '../../../components/external/ImageViewer';
import AddFile from './AddFile';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const MemberStack = createStackNavigator({
  MemberScreen: {
    screen: MemberScreen,
    navigationOptions: {
      title: 'Management',
    },
  },
  MemberFilter: {
    screen: MemberFilter,
    navigationOptions: {
      title: 'Member Filter',
   
    },
  },
  AddMember: {
    screen: AddMember,
    navigationOptions: {
      title: 'New Member',
    
    },
  },
  CountryList: {
    screen: CountryList,
  },
  UsersList: {
    screen: UsersList,
    navigationOptions: {
      //title: 'Users',
    
    },
  },
  EditMember: {
    screen: EditMember,
    navigationOptions: {
      title: 'Update Member',
    
    },
  },
  DesignationList: {
    screen: DesignationList,
    navigationOptions: {
      title: 'Designation',
     
    },
  },
  DepartmentList: {
    screen: DepartmentList,
    navigationOptions: {
      title: 'Department',
    
    },
  },
  ImageViewer: {
    screen: ImageViewer,
    navigationOptions: {
      title: 'View Image',
      
    },
  },
  AddFile: {
    screen: AddFile,
    navigationOptions: {
      title: 'Upload Document',
   
    },
  },
  Notification: {
    screen: NotificationList,
    navigationOptions: {
      title: 'Notifications',
    
    },
  },
},
{
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
  }
},
);

export default MemberStack;
