import React from 'react';
import {View} from 'react-native';
import BlocksForm from '../../FormsComponent/Forms/BlocksForm';
import {styless} from '../../../components/common/Styles';
import CallBlocks from '../../FormsComponent/Forms/CallBlocks';
import CallPager from '../../FormsComponent/Forms/CallPager';

export default class CreateAdd extends React.PureComponent {
  render() {

    let applicationId = 
    this.props.navigation.state.params !== undefined
      ? this.props.navigation.state.params.applicationId
      : undefined

    return (
      <View style={{flex:1}}>
        <CallBlocks navigation={this.props.navigation} applicationId={applicationId} formId={'3'} submitApiName={'NewsFeedAdd'}/>
      </View>
    );
  }
}
