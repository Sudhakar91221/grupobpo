/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {getTerms} from '../Actions/DashboardActions';
import {GET_CONTENTS} from '../Actions/type';
import {
  contentsSelector,
  apiSelector,
  isLoadingSelector,
  errorSelector,
} from '../Actions/selector';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';

class WebviewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageContents: undefined,
    };
  }

  componentWillMount() {
    let title = this.props.navigation.state.params.title;
    var input = {};
    switch (title) {
      case 'Terms Of Use': {
        input = {
          page: 2,
        };
        break;
      }
      case 'Privacy Policy': {
        input = {
          page: 1,
        };
        break;
      }
    }

    this.props.getTerms(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === GET_CONTENTS) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (!this.props.error && this.props.api === GET_CONTENTS) {
      if (this.props.pageContents !== prevProps.pageContents) {
        this.setState({pageContents: this.props.pageContents});
      }
    }
  }

  render() {
    if (this.state.pageContents === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <View style={{flex: 1}}>
        <WebView source={{html: this.state.pageContents}} />
      </View>
    );
  }
}

const WebviewScreenNew = withTheme(WebviewScreen);

WebviewScreenNew.navigationOptions = ({navigation, screenProps, params}) => {
  //To hide the NavigationBar from current Screen
  const {theme} = screenProps;

  return {
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
    title: navigation.state.params.title,
    headerStyle: {
      backgroundColor: '#383C55',
    },
    headerTintColor: 'white',
  };
};

function mapStateToProps(state) {
  // if(state.UserReducer.error && state.UserReducer.error.message != "") {
  //      Alert.alert(state.UserReducer.error.message)
  // }

  return {
    isLoading: isLoadingSelector(state.DashboardReducer),
    api: apiSelector(state.DashboardReducer),
    error: errorSelector(state.DashboardReducer),
    user: userLoginSelector(state.FormReducer),
    pageContents: contentsSelector(state.DashboardReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getTerms: input => dispatch(getTerms(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WebviewScreenNew);
