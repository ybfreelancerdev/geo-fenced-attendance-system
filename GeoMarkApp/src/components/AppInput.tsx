import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as colors from '../styles/colors';
import fonts from '../constants/fonts';

const AppInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  touched,
  icon,
  keyboardType = "default",
  secureTextEntry = false,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  containerStyle,
  inputStyle,
  placeholderColor = colors.Form_PlaceholderColor,
  iconColor = colors.FormIcon_COLOR,
  type = "text", // 👈 NEW
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  const [chipInput, setChipInput] = useState("");

  // 👉 Add chip
  const addChip = (text?: string) => {
    const chip = (text ?? chipInput).trim();
    if (!chip) return;

    if (!value.includes(chip)) {
      onChangeText([...value, chip]);
    }

    setChipInput("");
  };

  // 👉 Remove chip
  const removeChip = (index: number) => {
    const updated = value.filter((_: any, i: number) => i !== index);
    onChangeText(updated);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.focused,
          error && touched && styles.errorBorder,
          !editable && { backgroundColor: colors.Form_DisabledColor },
          type === "chips" && { flexWrap: "wrap" },
        ]}
      >
        {/* Left Icon */}
        {icon && (
          <MaterialIcons
            name={icon}
            size={fonts.size._20px}
            color={error && touched ? colors.Form_ErrorColor : iconColor}
            style={styles.icon}
          />
        )}

        {/* 🔥 Chips Mode */}
        {type === "chips" ? (
          <>
            {value?.map((chip: string, index: number) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
                <TouchableOpacity onPress={() => removeChip(index)}>
                  <MaterialIcons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            <TextInput
              style={[styles.input, { minWidth: 0 }]}
              value={chipInput}
              placeholder={value?.length === 0 ? placeholder : ''}
              placeholderTextColor={placeholderColor}
              onChangeText={(text) => {
                if (text.includes(",")) {
                  const parts = text.split(",");
                  parts.forEach((p) => addChip(p));
                } else {
                  setChipInput(text);
                }
              }}
              onSubmitEditing={() => addChip()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              blurOnSubmit={false}
            />
          </>
        ) : (
          <>
            {/* Normal Input */}
            <TextInput
              style={[
                styles.input,
                multiline && { height: 100, textAlignVertical: "top" },
                inputStyle,
              ]}
              value={value}
              onChangeText={onChangeText}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur && onBlur(e);
              }}
              onFocus={() => setIsFocused(true)}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor}
              keyboardType={keyboardType}
              secureTextEntry={hidePassword}
              maxLength={maxLength}
              multiline={multiline}
              numberOfLines={numberOfLines}
              editable={editable}
            />

            {/* Password Toggle */}
            {secureTextEntry && (
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <MaterialIcons
                  name={hidePassword ? "visibility-off" : "visibility"}
                  size={fonts.size._20px}
                  color={colors.FormIcon_COLOR}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Error */}
      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    // marginBottom: 15,
  },

  label: {
    fontFamily: fonts.name.regular,
    fontSize: fonts.size._13px,
    marginBottom: 5,
    color: colors.Form_InputLableCOLOR,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.Form_BorderColor, //"#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    // height: 50,
  },

  input: {
    flex: 1,
    fontFamily: fonts.name.regular,
    fontSize: fonts.size._14px,
    color: colors.Form_InputCOLOR //"#111827",
  },

  icon: {
    marginRight: 8,
  },

  focused: {
    borderColor: colors.APP_COLOR//"#24B47F",
  },

  errorBorder: {
    borderColor: colors.Form_ErrorColor //"#EF4444",
  },

  errorText: {
    color: colors.Form_ErrorColor, //"#EF4444",
    marginTop: 4,
    fontFamily: fonts.name.regular,
    fontSize: fonts.size._12px,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.APP_COLOR,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },

  chipText: {
    color: "#fff",
    marginRight: 5,
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular
  },
});