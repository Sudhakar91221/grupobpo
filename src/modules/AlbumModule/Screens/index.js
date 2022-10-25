import {createStackNavigator} from 'react-navigation-stack';
import Album from './Album';
import AddAlbum from './AddAlbum';
import EditAlbum from './EditAlbum';
import AlbumDetail from './AlbumDetail';
import ImageViewer from '../../../components/external/ImageViewer';
import NotificationList from '../../NotificationModule/Screens/NotificationList';

const AlbumStack = createStackNavigator(
  {
    Album: {
      screen: Album,
    },
    AddAlbum: {
      screen: AddAlbum,
      navigationOptions: {
        title: 'New Album',
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
    EditAlbum: {
      screen: EditAlbum,
      navigationOptions: {
        title: 'Update Album',
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
    AlbumDetail: {
      screen: AlbumDetail,
      navigationOptions: {
        title: 'Album',
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
    initialRouteName: 'Album',
  },
);

export default AlbumStack;
