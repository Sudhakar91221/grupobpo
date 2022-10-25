import {createStackNavigator} from 'react-navigation-stack';
import FormList from './FormList';
import NewMember from './NewMember';
import FormType from './FormType';
import InputForm from '../../FormsComponent/Forms/InputForm';
import AnotherScreen from '../../FormsComponent/Component/AnotherScreen';
import FormPager from '../../FormsComponent/Forms/CallPager';
import ApplicationList from './ApplicationList';
import SuccessForm from '../../FormsComponent/Forms/SuccessForm';
import ApplicationMain from './ApplicationMain';
import PreviewSummary from '../../FormsComponent/Forms/PreviewSummary';
import Application from './Application';
import CountryList from '../../FormsComponent/Component/Phone/CountryList';
import {AppStack} from '../../Base/BottomTab/Stack';
import NewBusiness from '../BusinessPermit/NewBusiness';
import SingleForm from '../../FormsComponent/Forms/SingleForm';
import ImageViewer from '../../../components/external/ImageViewer';

const FormStack = createStackNavigator(
  {
    Dashboard: {
      screen: ApplicationMain,
      navigationOptions: {
        title: 'My eApplications',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 10,
          fontSize: 28,
          color: 'black',
          fontWeight: '500',
        },
      },
    },
    Application: {
      screen: Application,
    },
    NewMember: {
      screen: NewMember,
    },
    FormList: {
      screen: FormList,
    },
    FormType: {
      screen: FormType,
    },
    FormPager: {
      screen: FormPager,
    },
    NewBusiness: {
      screen: NewBusiness,
    },
    InputForm: {
      screen: InputForm,
    },
    SingleForm: {
      screen: SingleForm,
    },
    CountryList: {
      screen: CountryList,
    },
    SuccessForm: {
      screen: SuccessForm,
      navigationOptions: {
        title: 'Form Submitted',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 10,
          fontSize: 28,
          color: 'black',
          fontWeight: '500',
        },
      },
    },
    AnotherScreen: {
      screen: AnotherScreen,
    },
    ApplicationList: {
      screen: ApplicationList,
    },

    PreviewSummary: {
      screen: PreviewSummary,
      navigationOptions: {
        title: 'Preview Summary',
        headerTitleStyle: {
          textAlign: 'left',
          alignSelf: 'flex-start',
          flex: 1,
          paddingRight: 0,
          paddingTop: 10,
          fontSize: 28,
          color: 'black',
          fontWeight: '500',
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
          fontWeight: 'bold',
        },
        headerTintColor: '#FFF',
      },
    },
  },
  {
    initialRouteName: 'Dashboard',
  },
);

FormStack.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (
        route.routeName === 'Dashboard' ||
        route.routeName === 'Application'
      ) {
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

export default FormStack;
