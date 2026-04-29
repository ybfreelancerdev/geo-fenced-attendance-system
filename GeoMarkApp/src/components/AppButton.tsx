import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as colors from '../styles/colors';
import fonts from '../constants/fonts';

const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left", // left | right
  backgroundColor = colors.Form_ButtonCOLOR,
  textColor = "#fff",
  style,
  textStyle,
}: any) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        { backgroundColor: backgroundColor, opacity: isDisabled ? 0.7 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <MaterialIcons
              name={icon}
              size={fonts.size._18px}
              color={textColor}
              style={{ marginRight: 6 }}
            />
          )}

          {/* Text */}
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {title}
          </Text>

          {/* Right Icon */}
          {icon && iconPosition === "right" && (
            <MaterialIcons
              name={icon}
              size={fonts.size._18px}
              color={textColor}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    width: '100%'
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: fonts.size._15px,
    fontFamily: fonts.name.bold
  },
});