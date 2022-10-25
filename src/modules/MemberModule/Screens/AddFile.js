/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';
import {TextField} from 'react-native-material-textfield';


class AddFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, padding: 10}}>
          <TextField
            label="Title"
            value={this.state.title}
            onChangeText={this.onChangeText}
            maxLength={50}
            multiline={false}
            tintColor={theme.primaryColor}
            baseColor={theme.primaryColor}
          />
          <Text
            style={[
              theme.detail,
              {
                color: 'black',
                paddingTop: 15,
                fontWeight: '600',
                paddingLeft: 10,
                fontSize: 16,
              },
            ]}
            numberOfLines={1}>
            Select file
          </Text>
          <View style={{padding: 5, flex: 1}}>
            <UploadSingleImage
              isAddImage={true}
              navigation={this.props.navigation}
              getUploadedFileName={this.getUploadedFileName}
              isUploadImage={true}
              input={{
                type: this.props.navigation.state.params.type,
                typeId: this.props.navigation.state.params.typeId,
                title: this.state.title,
              }}
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

  onChangeText(text) {
    this.setState({title: text});
  }

  getUploadedFileName = (imageToUpload, tempImageName) => {
    this.state.imageToUpload = imageToUpload;
  };

  onSubmitTapped() {
    this.props.navigation.state.params.getSelectedFile(this.state.title);
  }
}
const AddFileNew = withTheme(AddFile);
AddFileNew.navigationOptions = ({navigation, screenProps, params}) => {
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

export default withTheme(AddFileNew);
