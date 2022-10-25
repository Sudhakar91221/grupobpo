/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, View, Text} from 'react-native';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {flatListItemSeparator} from '../../../components/utility/common';
import {withTheme} from 'react-native-paper';
import AttendeeCell from './AttendeeCell';

class AttendeeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendeeList: this.props.navigation.state.params.attendeeList,
    };
  }

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    const title = params ? params.title : 'Attendees';

    return {
      title: title,
    };
  };

  render() {
    const {theme} = this.props;

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.attendeeList === undefined ? (
            <ActivityIndicatorCustom />
          ) : this.state.attendeeList.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1, padding: 10}}>
              <FlatList
                data={this.state.attendeeList}
                renderItem={this.renderAttendeeItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                ItemSeparatorComponent={flatListItemSeparator}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  renderAttendeeItem = ({item}) => {
    return <AttendeeCell item={item} navigation={this.props.navigation} />;
  };

  renderNoRecords() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
          }}>
          No Records Available
        </Text>
      </View>
    );
  }
}

export default withTheme(AttendeeList);
