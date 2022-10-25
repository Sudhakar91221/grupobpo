/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Alert, FlatList} from 'react-native';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {getDocumentsSelector} from '../../FileModule/Actions/selectors';
import {getDocuments} from '../../FileModule/Actions/FileActions';
import {GET_DOCUMENT} from '../../FileModule/Actions/type';
import {
  flatListItemSeparator,
  flatListItemSpaceSeparator,
} from '../../../components/utility/common';
import DocViewCell from './DocViewCell';

class EmpDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount() {
    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      userId: this.props.user.userId,
      request: GET_DOCUMENT,
    };
    this.props.getDocuments(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_DOCUMENT) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],

          {cancelable: false},
        );
      }
    }

    //get documents
    if (this.props.api === GET_DOCUMENT) {
      if (this.props.error !== null && this.props.api === GET_DOCUMENT) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === GET_DOCUMENT) {
        if (this.props.documentsData !== prevProps.documentsData) {
          this.setState({
            documentsData: this.props.documentsData,
          });
        }
      }
    }
  }

  render() {
    if (this.state.documentsData === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <View style={{flex: 1, padding: 10}}>
        <FlatList
          data={this.state.documentsData}
          renderItem={this.renderItem}
          numColumns={1}
          extraData={this.props}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={flatListItemSpaceSeparator}
        />
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <DocViewCell
        item={item}
        navigation={this.props.navigation}
        employeeId={this.props.navigation.state.params.item.employeeId}
      />
    );
  };
}
const EmpDocumentsNew = withTheme(EmpDocuments);
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FileReducer),
    api: apiSelector(state.FileReducer),
    error: errorSelector(state.FileReducer),
    documentsData: getDocumentsSelector(state.FileReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getDocuments: input => dispatch(getDocuments(input)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EmpDocumentsNew);
