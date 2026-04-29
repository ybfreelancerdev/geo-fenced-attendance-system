import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getStatusBarHeight } from '../constants';
import * as colors from '../styles/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import fonts from '../constants/fonts';

const STATUS_BAR_HEIGHT = getStatusBarHeight();
const HEADER_HEIGHT = 45 + STATUS_BAR_HEIGHT;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const Header = (
  {
    title,
    titleColor = '#fff',
    showBackIcon = false,
    navigation,
    visibleFilterIcon = false,
    onIconPress,
    backgroundColor,
    menuIconVisible = false,
    profileIconVisible = false,
    closeButton = false,
    bgColor
  }: any) => {

  return (
    <View
      style={{
        height: HEADER_HEIGHT,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: bgColor ? bgColor : colors.APPHeader_COLOR,
        elevation: 1
      }}>
      <StatusBar backgroundColor={bgColor ? bgColor : colors.APPHeader_COLOR}   // Android
        barStyle={ bgColor === '#fff' ? "dark-content" : "light-content"} />
      <View style={styles.statusBar}></View>
      <View style={styles.container}>
        {/* Left: Back Button */}
        <View style={{ flex: 0.1, justifyContent: 'center' }}>
          {showBackIcon ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.side}>
              <MaterialIcons name="keyboard-arrow-left" size={40} color="#F4F4F4" />
            </TouchableOpacity>
          )
            : (
              <View style={styles.side} />
            )}
        </View>

        {/* Center: Title */}
        <View style={styles.center}>
          <Text style={[styles.title, {color: titleColor}]}>{title}</Text>
        </View>

        {/* Right: Spacer to balance layout */}
        <View style={{ flex: 0.1, justifyContent: 'center' }}>
          {visibleFilterIcon ?
            (<TouchableOpacity style={[styles.side, { marginRight: 12 }]} onPress={onIconPress}>
              <AntDesign
                name="calendar"
                size={25}
                color={
                  backgroundColor === 'transpasrent' ? colors.APP_COLOR : '#fff'
                }
              />
            </TouchableOpacity>)
            :
            closeButton ?
              (
                <TouchableOpacity style={[styles.side, { marginRight: 12 }]} onPress={onIconPress}>
                  <AntDesign
                    name="close"
                    size={25}
                    color={
                      backgroundColor === 'transpasrent' ? colors.APP_COLOR : '#fff'
                    }
                  />
                </TouchableOpacity>
              )
              :
              (<View style={styles.side}></View>
              )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  side: {
    // width: 40, // Must match left and right widths
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    fontFamily: fonts.name.bold,
    fontSize: fonts.size._18px,
  },
});