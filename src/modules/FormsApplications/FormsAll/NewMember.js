/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {BottomButton} from '../../../components/views/Button';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import ImageCell from '../../FormsComponent/Component/Image/ImageCell';
import {ScreenWidth, ScreenHeight} from '../../../components/utility/Settings';
import {translate} from '../../../../App';
import BaseClass from '../../Base/BaseClass';

export const ImageRow = ({name, id, url, height, width, tintColor}) => {
  if (name === 'default') {
    return (
      <View style={{width: width, height: height, paddingHorizontal: 5}}>
        <Image
          source={
            url !== undefined ? url : require('../../../asset/contact-form.png')
          }
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            paddingTop: 0,
            tintColor: tintColor !== undefined ? tintColor : null,
          }}
          tintColor={tintColor !== undefined ? tintColor : null}
        />
      </View>
    );
  }
  return (
    <View style={{width: width, height: height}}>
      <ImageCell
        placeholderImage={'../../../asset/logo.png'}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'green',
          paddingTop: 0,
        }}
        id={id} //this s required for downloading - ex. NewsId
        item={name}
        isActual={true}
        isCircular={false}
        tintColor={tintColor !== undefined ? tintColor : null}
        // children={this.renderMoreButton(item)}
        navigation={this.props.navigation}
      />
    </View>
  );
};

class NewMember extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.onStartEApplicationTapped = this.onStartEApplicationTapped.bind(this);
    this.onAddEApplicationFormButtonTapped = this.onAddEApplicationFormButtonTapped.bind(
      this,
    );
  }

  //MARK: - View LIfecycle

  componentDidMount() {}

  componentDidUpdate() {}

  //MARK: - Render Main

  render() {
    const {theme} = this.props;
    console.log('hrere is headerrrrrrrrrr');
    console.log(this.props);

    return (
      <BaseClass title={translate('my_eapplications')}>
        <ScrollView
          style={{flex: 1, bottom: 0, paddingHorizontal: 20, paddingTop: 30}}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
          keyboardDismissMode="on-drag">
          <Text
            style={[
              theme.header,
              {
                paddingLeft: -10,
                textAlign: 'center',
                justifyContent: 'center',
                color: theme.detailColor,
              },
            ]}>
            {translate('seamless_process_permit_submission')}
          </Text>
          <ImageRow
            name={'default'}
            width={ScreenWidth - 80}
            height={ScreenHeight * 0.25}
          />
          <Text
            style={[
              theme.detailLarge,
              {paddingTop: 20, textAlign: 'center', color: theme.detailColor},
            ]}>
            {translate('fill_form')}
          </Text>
          <View style={{paddingTop: 30}}>{this.renderBottomButton()}</View>
        </ScrollView>
      </BaseClass>
    );
  }

  //MARK: - Event Handler
  onAddEApplicationFormButtonTapped = () => {
    // this.props.navigation.navigate('FormList');
    this.props.navigation.navigate('ApplicationList');
  };

  onStartEApplicationTapped = () => {
    this.props.navigation.navigate('FormList');
  };


  

  //MARK: - Render UI

  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View style={{backgroundColor: 'transparent', height: 55}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            position: 'absolute',
            bottom: 20,
            width: '100%',
          }}
          backgroundColor={theme.blueColor}
          title={translate('get_started')}
          action={this.onStartEApplicationTapped}
          activeState={true}
          isLoader={false}
          isGray={false}
        />
      </View>
    );
  }
}

const NewMemberNew = withTheme(NewMember);

NewMemberNew.navigationOptions = ({screenProps}) => {
  const {theme} = screenProps;
  return {
    title: translate('my_eApplications'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingTop: 10,
      fontSize: 28,
      color: 'black',
      fontWeight: '500',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default NewMemberNew;
