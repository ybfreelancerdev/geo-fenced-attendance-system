import React from 'react';
import {ActivityIndicator} from 'react-native';
import * as colors from '../styles/colors';

const Loader = ({size = 'small', style, color = colors.SPINNER}:any) => (
  <ActivityIndicator size={size} style={style} color={color} />
);

export default Loader;
