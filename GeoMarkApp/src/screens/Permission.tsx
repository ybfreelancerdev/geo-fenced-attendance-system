import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { request, PERMISSIONS } from "react-native-permissions";

export default function PermissionScreen({ navigation }:any) {
  const requestPermission = async () => {
    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        We need location access to track your attendance automatically.
      </Text>

      <Button title="Allow Location" onPress={requestPermission} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  text: { marginBottom: 20, fontSize: 16 },
});