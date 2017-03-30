import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import Avatar from './Avatar';
import Bubble from './Bubble';
import Day from './Day';

import {isSameUser, isSameDay} from './utils';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  getInnerComponentProps() {
    const {containerStyle, ...props} = this.props;
    return {
      ...props,
      isSameUser,
      isSameDay
    }
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps();
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps}/>;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = this.getInnerComponentProps();
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps} onPress = {this.onPress}/>;
  }

  onPress() {
    if (this.props.onPress) {
      this.props.onPress(this.props.currentMessage);
    } else {
      if (this.props.currentMessage.failed) {
        const options = [
          'Resend',
          'Delete',
          'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                this.props.onResend ? this.props.onResend([this.props.currentMessage]) : null;
                break;
              case 1:
                this.props.onDelete ? this.props.onDelete(this.props.currentMessage._id) : null;
                break;
            }
          });
      }
    }
  }

  renderFailed() {
    if (this.props.currentMessage.failed) {
      return (
        <TouchableWithoutFeedback
          onPress={this.onPress}>
          <View style={[styles.failedWrapper]}>
            <Text style={[styles.failedIconText]}>
              !
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }

  render() {
    return (
      <View>
        {this.renderDay()}
        <View style={[styles[this.props.position].container, {
          marginBottom: isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
        }, this.props.containerStyle[this.props.position]]}>
          {this.props.position === 'right' ? this.renderFailed() : null}
          {this.renderBubble()}
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
  failedWrapper: {
    width: 24,
    height: 24,
    borderRadius: 13,
    borderColor: '#424242',
    borderWidth: 2,
    backgroundColor: '#424242',
    alignSelf: 'center',
    marginRight: -52,
    zIndex: 1,
  },
  failedIconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
};

Message.contextTypes = {
  actionSheet: React.PropTypes.func,
};

Message.defaultProps = {
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  onPress: null,
  onResend: null,
  onDelete: null,
};

Message.propTypes = {
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  user: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  onPress: React.PropTypes.func,
  onResend: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};
