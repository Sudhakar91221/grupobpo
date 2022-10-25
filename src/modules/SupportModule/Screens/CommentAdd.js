import React from 'react';
// import Button from 'react-native-button';
import Modal from '../../../components/external/ModalBox/ModalBox';
// import Slider from 'react-native-slider';

import {
  AppRegistry,
  Text,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  TextInput,
} from 'react-native';

var screen = Dimensions.get('window');

export default class CommentAdd extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
    };
  }

  onClose() {
    console.log('Modal just closed');
  }

  onOpen() {
    console.log('Modal just opened');
  }

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  renderList() {
    var list = [];

    for (var i = 0; i < 50; i++) {
      list.push(
        <Text style={styles.text} key={i}>
          Elem {i}
        </Text>,
      );
    }

    return list;
  }

  renderPostCommentView() {
    return (
      <View style={styles.wrapper}>
        {/* <Button onPress={() => this.refs.addReplyRef.open()} style={styles.btn}>Position bottom + ScrollView</Button> */}

        {/* <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"addReplyRef"} swipeArea={20}> */}

        <Modal
          style={[styles.modal, styles.modal1]}
          ref={'addReplyRef'}
          swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}
          swipeArea={20}
          position={'bottom'}>
          <ScrollView>
            <View style={{width: screen.width, paddingLeft: 10}}>
              {this.renderList()}
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    flex: 1,
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal2: {
    height: 230,
    backgroundColor: '#3B5998',
  },

  modal3: {
    height: 300,
    width: 300,
  },

  modal4: {
    height: 300,
  },

  btn: {
    margin: 10,
    backgroundColor: '#3B5998',
    color: 'white',
    padding: 10,
  },

  btnModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },

  text: {
    color: 'black',
    fontSize: 22,
  },
});
