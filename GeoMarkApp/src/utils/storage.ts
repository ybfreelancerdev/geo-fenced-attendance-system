import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (user:any) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getUser = async () => {
  const data = await AsyncStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};