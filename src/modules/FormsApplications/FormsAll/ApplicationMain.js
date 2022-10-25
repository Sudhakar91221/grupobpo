/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, ScrollView, Alert} from 'react-native';
import {BottomButton} from '../../../components/views/Button';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import ImageCell from '../../FormsComponent/Component/Image/ImageCell';
import {ScreenWidth, ScreenHeight} from '../../../components/utility/Settings';
import {translate} from '../../../../App';
import BaseClass from '../../Base/BaseClass';
import {styless} from '../../../components/common/Styles';
import FloatingButton from '../../../components/views/FloatingButton';
import {
  isLoadingSelector,
  applicationsListSelector,
  apiSelector,
  errorSelector,
  // successSelector,
} from '../../FormsComponent/Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';

import {
  PRODUCT_ADD,
  PRODUCT_UPDATE,
  APPLICATION_GET,
} from '../../FormsComponent/Actions/type';
import {getApplications} from '../../FormsComponent/Actions/FormActions';

import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';

class ApplicationMain extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    this.state = {
      applications: [],
    };
  }

  //MARK: - View LIfecycle

  componentDidMount() {
    this.fetchData();
  }

  shouldComponentUpdate() {
    // console.log('on back getting called')
    return true;
  }

  componentWillReceiveProps() {
    // console.log('on back getting called')
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === APPLICATION_GET) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (!this.props.error && this.props.api === APPLICATION_GET) {
      if (this.props.applications !== prevProps.applications) {
        // this.setState({applications: this.props.applications});
        this.state.applications = this.props.applications;

        if (
          this.props.applications !== undefined &&
          this.props.applications.length > 0
        ) {
          this.props.navigation.replace('ApplicationList');
          //this.props.navigation.replace('Application');
        } else {
          this.props.navigation.replace('NewMember');
        }
      }
    }
  }

  //MARK: - Render Main

  render() {
    const {theme} = this.props;
    console.log(this.props);

    return (
      <BaseClass title={translate('eApplications')}>
        {/* <NavigationEvents
                onDidFocus={() => Alert.alert('Refreshed')}
                /> */}
      </BaseClass>
    );
  }

  //MARK: - Event Handler

  fetchData() {
    this.callGetApplications();
  }

  //MARK: - Render UI

  //MARK: - API CALL

  callGetApplications() {
    if (this.props.user === undefined) {
    } else {
      var input = {
        userId: this.props.user.userId,
        token: this.props.user.token,
        page: '1',
      };
      this.props.getApplication(input);
    }
  }
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    applications: applicationsListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    // successMessage: successSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getApplication: input => dispatch(getApplications(input)),
  };
}

const ApplicationMainNew = withTheme(ApplicationMain);

ApplicationMainNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    navigationOptions: {
      title: translate('my_eApplications'),
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
    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationMainNew);
