import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated } from 'react-native';
import * as colors from "../styles/colors";
import fonts from '../constants/fonts';

const Loading = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.APP_COLOR}/>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
  },
  text: {
    marginTop: 16,
    fontSize: fonts.size._16px,
    fontFamily: fonts.name.medium,
    color: colors.APP_COLOR,
  },
});
