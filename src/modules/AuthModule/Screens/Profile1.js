import React from 'react';
import {View} from 'react-native';
import BlocksForm from '../../FormsComponent/Forms/BlocksForm';
import {styless} from '../../../components/common/Styles';
import CallBlocks from '../../FormsComponent/Forms/CallBlocks';
import CallPager from '../../FormsComponent/Forms/CallPager';
import CallRegisterBlocks from '../../FormsComponent/Forms/CallRegisterBlocks';

export default class Profile1 extends React.PureComponent {
  render() {

    let applicationId = 
    this.props.navigation.state.params !== undefined
      ? this.props.navigation.state.params.applicationId
      : undefined

    return (
      <View style={{flex:1}}>
        <CallRegisterBlocks navigation={this.props.navigation} applicationId={applicationId} formId={'2'} blockId={'5'} submitApiName={'EditProfile'}/>
      </View>
    );
  }
}
