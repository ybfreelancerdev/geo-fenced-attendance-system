import { StyleSheet, Text, View } from "react-native";
import * as colors from "../styles/colors";
import fonts from '../constants/fonts';

export const CustomToast = ({ text1, text2, props }:any) => {
  return (
    <View style={[styles.container, props.type === 'error' && styles.error]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
    borderColor: colors.Form_BorderColor,
    borderWidth: 0.5,
    elevation: 5
  },
  error: {
    backgroundColor: '#c62828',
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.Inputtext_COLOR,
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular
  },
  message: {
    color: '#e0e0e0',
    fontSize: 14,
  },
});