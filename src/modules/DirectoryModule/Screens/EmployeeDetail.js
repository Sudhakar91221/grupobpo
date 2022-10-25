import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import EmployeeDetailTopTab from './EmployeeDetailTab';
import {DrawerIcon, AddButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {withCollapsibleForTab} from 'react-navigation-collapsible';
import {isPermissionAllowed} from '../../../network/APICall';
import AboutScreen from './AboutScreen';
import TimesheetScreen from './TimesheetScreen';

const EmployeeDetail = createMaterialTopTabNavigator(
  {
    About: {screen: AboutScreen},
    Timesheets: {screen: TimesheetScreen},
  },
  {
    tabBarComponent: prop => <EmployeeDetailTopTab {...prop} />,
  },
);

EmployeeDetail.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
  };
};

const GroupImageHeader = ({navigation, collapsible}) => {
  const {translateY, translateOpacity, translateProgress} = collapsible;
  //return <BaseClass title={translate('my_advertisements')} />;
  return null;
};
const collapsibleParams = {
  collapsibleComponent: GroupImageHeader,
  collapsibleBackgroundStyle: {
    height: 0,
    backgroundColor: 'white',
    disableFadeoutInnerComponent: true,
  },
};
export default withCollapsibleForTab(EmployeeDetail, collapsibleParams);
