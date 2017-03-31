import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Lightbox from 'react-native-lightbox';

export default class MessageImage extends React.Component {
  renderImage() {
    const { width } = Dimensions.get('window');
    const { ratio } = this.props.currentMessage
    const bubbleWidth = width - 74
    const imageHeight = bubbleWidth / ratio < bubbleWidth ? bubbleWidth / ratio : bubbleWidth

    return (
      <Image
        {...this.props.imageProps}
        style={[styles.image, this.props.imageStyle, { width: bubbleWidth, height: imageHeight }]}
        source={{uri: this.props.currentMessage.image}}
      />
    )
  }

  renderImageTouch() {
    const { width, height } = Dimensions.get('window');

    if (this.props.currentMessage.banner) {
      return (
        <TouchableWithoutFeedback
          onPress={this.props.onPress}
          {...this.props.touchableProps}
        >
          {this.renderImage()}
        </TouchableWithoutFeedback>
      )
    } else {
      return (
        <Lightbox
          activeProps={{
            style: [styles.imageActive, { width, height }],
          }}
          {...this.props.lightboxProps}
        >
          {this.renderImage()}
        </Lightbox>
      )
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {this.renderImageTouch()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    resizeMode: 'contain',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
  onPress: null,
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,
  lightboxProps: React.PropTypes.object,
  onPress: React.PropTypes.func,
};
