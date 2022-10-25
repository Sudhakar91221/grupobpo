import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import CustomMemberTopTab from './EditMemberTab';
import EditPersonal from './EditPersonal';
import EditAddress from './EditAddress';
import EditJob from './EditJob';
import {withCollapsibleForTab} from 'react-navigation-collapsible';
import EditSalary from './EditSalary';
import EditBank from './EditBank';
import EditFamily from './EditFamily';
import LeaveInfo from './LeaveInfo';
import EmpDocuments from './EmpDocuments';

const UpdateMember = createMaterialTopTabNavigator(
  {
    Personal: {screen: EditPersonal},
    Address: {screen: EditAddress},
    Job: {screen: EditJob},
    Salary: {screen: EditSalary},
    Bank: {screen: EditBank},
    Family: {screen: EditFamily},
    Leave: {screen: LeaveInfo},
    Documents: {screen: EmpDocuments},
  },
  {
    tabBarComponent: prop => <CustomMemberTopTab {...prop} />,
  },
);

UpdateMember.navigationOptions = ({navigation, screenProps, params}) => {
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
export default withCollapsibleForTab(UpdateMember, collapsibleParams);
