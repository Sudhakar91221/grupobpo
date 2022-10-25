/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ALBUM_ADD} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  albumAddSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {albumAdd} from '../Actions/AlbumActions';
import {connect} from 'react-redux';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';

class AddAlbum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == ALBUM_ADD) {
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

    //add album
    if (this.props.api === ALBUM_ADD) {
      if (this.props.error !== null && this.props.api === ALBUM_ADD) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === ALBUM_ADD) {
        if (this.props.albumId !== this.state.albumId) {
          Alert.alert(
            'Album added successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{height: 350}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['album'] = ref;
              }}
              item={formData}
              blockModel={formData}
              formId={'0'}
              navigation={this.props.navigation}
              editable={true}
              fromDetail={true}
              hideBottomButton={true}
              isRequireHeader={false}
            />
          </View>

          <View
            style={{
              paddingLeft: '25%',
              paddingRight: '25%',
              paddingTop: 20,
              paddingBottom: 30,
            }}>
            <BottomButton
              style={styless.bottomButton}
              title={translate('submit')}
              action={
                !this.state.submitLoader && !this.state.submitGray
                  ? this.onSubmitTapped
                  : null
              }
              isLoader={this.state.submitLoader}
              isGray={this.state.submitGray}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  onSubmitTapped() {
    var title = this.currentPageRef.album.currentFieldsRef.title.state.title;
    var details = this.currentPageRef.album.currentFieldsRef.description.state
      .description;

    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      albumName: title,
      desc: details,
      request: ALBUM_ADD,
    };
    this.props.albumAdd(input);
  }
}
const AddAlbumNew = withTheme(AddAlbum);
AddAlbumNew.navigationOptions = ({navigation, screenProps, params}) => {
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

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.AlbumReducer),
    api: apiSelector(state.AlbumReducer),
    error: errorSelector(state.AlbumReducer),
    albumId: albumAddSelector(state.AlbumReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    albumAdd: input => dispatch(albumAdd(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAlbumNew);
let formData = {
  fields: [
    {
      name: 'title',
      type: '1',
      lable: 'Title',
      rules: 'required',
    },
    {
      name: 'description',
      type: '1',
      lable: 'Description',
      rules: 'required',
    },
  ],
};
