/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CardView from 'react-native-cardview';
import {ScreenHeight, ScreenWidth} from '../utility/Settings';
import {withTheme} from '../common/Theme/themeProvider';

// BottomButton.defaultProps = {
//   isLoader: false,
//   isGray: false,
//   style: {height: ScreenHeight * 0.06},
// };

const BottomButton = withTheme(object => {
  // let isActiveState =
  //   object.isLoader === undefined || object.isLoader == false ? false : true;
  let isActiveState =
    object.isGray === undefined || object.isGray == false ? true : false;

  const backColor = object.theme.primaryColor;
  const buttonHeight =
    object.style !== undefined && object.style.height
      ? object.style.height
      : ScreenHeight * 0.06;
  const defaultStyle = [
    styles.buttonStyle,
    object.style,
    {
      backgroundColor:
        object.backgroundColor !== undefined
          ? object.backgroundColor
          : backColor,
    },
    {height: buttonHeight},
  ];

  const buttonStyle =
    isActiveState == true
      ? [defaultStyle, {}]
      : [defaultStyle, {backgroundColor: '#8c8c8c'}];

  return (
    <TouchableOpacity onPress={object.action} style={buttonStyle}>
      {/* <CardView
                    style={}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={0}
          > */}

      {isActiveState == true ? (
        <View style={styles.buttonContainerStyle}>
          {object.imageSource && (
            <Image
              style={styles.buttonImageStyle}
              source={object.imageSource}
            />
          )}
          {object.isLoader === true ? (
            <View>
              <ActivityIndicator size="large" color="white" />
              {object.loadingText !== undefined && (
                <Text
                  style={[
                    styles.buttonTextStyle,
                    {
                      paddingHorizontal: 10,
                      color:
                        object.textColor !== undefined
                          ? object.textColor
                          : 'white',
                    },
                  ]}>
                  {object.loadingText}
                </Text>
              )}
            </View>
          ) : (
            <View>
              <Text
                style={[styles.buttonTextStyle, {textTransform: 'uppercase', color:
                        object.textColor !== undefined
                          ? object.textColor
                          : 'white'}]}>
                {object.title}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.buttonContainerStyle}>
          {object.isLoader === true ? (
            <View>
              <ActivityIndicator size="large" color="white" />
              {object.loadingText !== undefined && (
                <Text style={[styles.buttonTextStyle, {paddingHorizontal: 10, color:
                        object.textColor !== undefined
                          ? object.textColor
                          : 'white'}]}>
                  {object.loadingText}
                </Text>
              )}
            </View>
          ) : (
            <View>
              <Text
                style={[styles.buttonTextStyle, {textTransform: 'uppercase', color:
                        object.textColor !== undefined
                          ? object.textColor
                          : 'white'}]}>
                {object.title}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* </CardView> */}
    </TouchableOpacity>
  );
});

const SizeButton = withTheme(object => {
  return (
    <TouchableOpacity
      onPress={object.action}
      style={[styles.anyWidthButtonStyle, object.style]}>
      <CardView
        style={[styles.anyWidthButtonStyle, object.style]}
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={0}>
        <TouchableOpacity
          onPress={object.action}
          style={styles.buttonTextStyle}>
          <View style={styles.buttonContainerStyle}>
            {object.imageSource && (
              <Image
                style={styles.buttonImageStyle}
                source={object.imageSource}
              />
            )}
            <Text style={styles.buttonTextStyle}>{object.title}</Text>
          </View>
        </TouchableOpacity>
      </CardView>
    </TouchableOpacity>
  );
});

const WhiteButton = withTheme(object => {
  return (
    <TouchableOpacity
      onPress={object.action}
      style={[
        styles.anyWidthButtonStyle,
        object.style,
        {backgroundColor: 'white'},
      ]}>
      <CardView
        style={[
          styles.anyWidthButtonStyle,
          object.style,
          {backgroundColor: 'white'},
        ]}
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={5}>
        <TouchableOpacity onPress={object.action}>
          <View>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', color: object.color}}>
              {object.title}
            </Text>
          </View>
        </TouchableOpacity>
      </CardView>
    </TouchableOpacity>
  );
});

export const PrevNextButton = object => (
  <CardView
    style={[styles.buttonPrevNextStyle, {backgroundColor: 'white'}]}
    cardElevation={2}
    cardMaxElevation={2}
    cornerRadius={5}>
    <TouchableOpacity onPress={object.action} style={styles.centerText}>
      <View
        style={[styles.buttonContainerStyle, {height: ScreenHeight * 0.07}]}>
        {object.imageSource && (
          <Image style={styles.buttonImageStyle} source={object.imageSource} />
        )}
        <Text style={styles.prevNextStyle}>{object.title}</Text>
      </View>
    </TouchableOpacity>
  </CardView>
);

export const BottomGreenButton = object => (
  <CardView
    style={[styles.bottomButtonViewStyle]}
    cardElevation={2}
    cardMaxElevation={2}
    cornerRadius={5}>
    <TouchableOpacity onPress={object.action} style={styles.centerText}>
      <View style={styles.buttonContainerStyle}>
        {object.imageSource && (
          <Image style={styles.buttonImageStyle} source={object.imageSource} />
        )}
        <Text style={styles.buttonTextStyle}>{object.title}</Text>
      </View>
    </TouchableOpacity>
  </CardView>
);

export {BottomButton, SizeButton, WhiteButton};

const styles = {
  bottomButtonViewStyle: {
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#383C55',
    height: ScreenHeight * 0.07,
    // alignSelf: "center",
    margin: 5,
    width: '50%',
  },
  anyWidthButtonStyle: {
    position: 'relative',
    borderRadius: 0,
    backgroundColor: '#383C55',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenHeight * 0.06,
  },
  buttonStyle: {
    position: 'relative',
    borderRadius: 0,
    backgroundColor: '#383C55',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonImageStyle: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    position: 'relative',
    tintColor: 'white',
    bottom: 3,
    marginRight: 15,
  },

  buttonTextStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },

  buttonContainerStyle: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 1,
  },

  buttonPrevNextStyle: {
    position: 'relative',
    bottom: 10,
    padding: 10,
    borderRadius: 10,
  },

  prevNextStyle: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    alignItems: 'center',
    height: ScreenHeight * 0.07,
    marginBottom: 15,
  },
  centerText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: ScreenHeight * 0.07,
    backgroundColor: 'clear',
  },
};
