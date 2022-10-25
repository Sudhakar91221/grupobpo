import {createStackNavigator} from 'react-navigation-stack';
import Announcement from './Announcement';
import AnnouncementDetail from './AnnouncementDetail';
import AddAnnouncement from './AddAnnouncement';
import UpdateAnnouncement from './UpdateAnnouncement';
import ImageViewer from '../../../components/external/ImageViewer';
import NotificationList from '../../NotificationModule/Screens/NotificationList';

const MoreStack = createStackNavigator(
  {
    Announcement: {
      screen: Announcement,
    },
    AnnouncementDetail: {
      screen: AnnouncementDetail,
      navigationOptions: {
        title: 'Announcement Details',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          fontSize: 26,
          color: 'white',
          marginTop: 10,
        },
      },
    },
    AddAnnouncement: {
      screen: AddAnnouncement,
      navigationOptions: {
        title: 'New Announcement',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          fontSize: 26,
          color: 'white',
          marginTop: 10,
        },
      },
    },
    UpdateAnnouncement: {
      screen: UpdateAnnouncement,
      navigationOptions: {
        title: 'Update Announcement',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          fontSize: 26,
          color: 'white',
          marginTop: 10,
        },
      },
    },
    ImageViewer: {
      screen: ImageViewer,
      navigationOptions: {
        title: 'View Image',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 13,
          fontSize: 22,
          color: 'white',
        },
        headerTintColor: '#FFF',
      },
    },
    Notification: {
      screen: NotificationList,
      navigationOptions: {
        title: 'Notifications',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          fontSize: 26,
          color: 'white',
          marginTop: 10,
        },
      },
    },
  },
  {
    initialRouteName: 'Announcement',
  },
);

// MoreStack.navigationOptions = ({navigation}) => {
//   let tabBarVisible;
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map(route => {
//       if (route.routeName === 'More') {
//         tabBarVisible = true;
//       } else {
//         tabBarVisible = false;
//       }
//     });
//   }

//   return {
//     tabBarVisible,
//   };
// };

export default MoreStack;
