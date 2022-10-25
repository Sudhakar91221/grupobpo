import React from 'react';
import {View, Text, Modal} from 'react-native';

export default class ModalView extends React.Component {

    state = {
        visible: false
    };

    close({then} = {}) {
        if (Platform.OS === 'ios') {
            this.setState({visible: false, onDismiss: then});
        } else {
            this.setState({visible: false});
            if (then !== undefined) {
                then();
            }
        }
    }

    show() {
        this.setState({visible: true});
    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onDismiss={this.state.onDismiss}
                {...this.props}>
                {this.props.children}
            </Modal>
        )
    }
}