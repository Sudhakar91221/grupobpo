import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {withCollapsibleForTab} from 'react-navigation-collapsible';
import CustomApplicationTopTab from './ApplicationTab';
import ApplicationList from './ApplicationList';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';

const ApplicationTop = createMaterialTopTabNavigator(
  {
    Processing: {screen: ApplicationList},
    Claiming: {screen: ApplicationList},
    Completed: {screen: ApplicationList},
  },
  {
    tabBarComponent: prop => <CustomApplicationTopTab {...prop} />,
  },
);

ApplicationTop.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: translate('my_eApplications'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      paddingTop: 10,
      fontSize: 30,
      color: 'black',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

const GroupImageHeader = ({navigation, collapsible}) => {
  const {translateY, translateOpacity, translateProgress} = collapsible;
  return <BaseClass title={translate('my_eapplications')} />;
};
const collapsibleParams = {
  collapsibleComponent: GroupImageHeader,
  collapsibleBackgroundStyle: {
    height: 0,
    backgroundColor: 'white',
    disableFadeoutInnerComponent: true,
  },
};
export default withCollapsibleForTab(ApplicationTop, collapsibleParams);
