/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ALBUM_EDIT} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  albumEditSelector,
} from '../Actions/selectors';
import {albumUpdate} from '../Actions/AlbumActions';
import {translate} from '../../../../App';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';

class UpdateAlbum extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.state.params.item;
    let formData = {
      fields: [
        {
          name: 'title',
          type: '1',
          lable: 'Title',
          rules: 'required',
          value: item.albumName,
        },
        {
          name: 'description',
          type: '1',
          lable: 'Description',
          rules: 'required',
          value: item.desc,
        },
      ],
    };
    this.state = {
      item: item,
      formData: formData,
    };

    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == ALBUM_EDIT) {
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

    //update album
    if (this.props.api === ALBUM_EDIT) {
      if (this.props.error !== null && this.props.api === ALBUM_EDIT) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
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

      if (!this.props.error && this.props.api === ALBUM_EDIT) {
        if (this.props.success !== prevProps.success) {
          Alert.alert(
            'Album updated successfully',
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
      <View style={{flex: 1}}>
        <View style={{height: 350}}>
          <InputForm
            onRef={ref => {
              this.currentPageRef['album'] = ref;
            }}
            item={this.state.formData}
            blockModel={this.state.formData}
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
    );
  }

  onSubmitTapped() {
    var title =
      this.currentPageRef.album.currentFieldsRef.title.state.title === ''
        ? this.state.item.albumName
        : this.currentPageRef.album.currentFieldsRef.title.state.title;

    var details =
      this.currentPageRef.album.currentFieldsRef.description.state
        .description === undefined
        ? this.state.item.desc
        : this.currentPageRef.album.currentFieldsRef.description.state
            .description;

    var input = {
      albumName: title,
      desc: details,
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      albumId: this.state.item.albumId,
      images: this.state.item.images,
      request: ALBUM_EDIT,
    };
    this.props.albumUpdate(input);
  }
}
const UpdateAlbumNew = withTheme(UpdateAlbum);
UpdateAlbumNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    success: albumEditSelector(state.AlbumReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    albumUpdate: input => dispatch(albumUpdate(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAlbumNew);
