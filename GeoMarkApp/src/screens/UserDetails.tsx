import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../components/Header";
import * as colors from "../styles/colors";
import fonts from '../constants/fonts';
import { formatEventDateTime } from "../utils/dateUtils";
import AppButton from "../components/AppButton";
import { blockUser } from "../services/apiService";
import { showCustom } from "../services/MessageService";

const UserDetails = ({ route, navigation }: any) => {
  const { user } = route.params;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBlockUser = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      let res = await blockUser(user.id);
      if (res && res.success) {
        showCustom(res.message);
        navigation.goBack();
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="User Details" navigation={navigation} showBackIcon/>

      {/* 👤 User Info Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="person" size={20} color={colors.APP_COLOR} />
          <Text style={styles.label}>Name</Text>
        </View>
        <Text style={styles.value}>{user.name}</Text>

        <View style={styles.row}>
          <MaterialIcons name="email" size={20} color={colors.APP_COLOR} />
          <Text style={styles.label}>Email</Text>
        </View>
        <Text style={styles.value}>{user.email}</Text>

        <View style={styles.row}>
          <MaterialIcons name="phone" size={20} color={colors.APP_COLOR} />
          <Text style={styles.label}>Phone</Text>
        </View>
        <Text style={styles.value}>{user.phone}</Text>

        <View style={styles.row}>
          <MaterialIcons name="calendar-today" size={20} color={colors.APP_COLOR} />
          <Text style={styles.label}>Created Date</Text>
        </View>
        <Text style={styles.value}>{formatEventDateTime(user.createdAt).full}</Text>
      </View>

      {/* 🚫 Block Button */}
      <View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 20}}>
        <AppButton
          title="Block User"
          icon="block"
          style={{ backgroundColor: "#EF4444" }}
          loading={loading}
          onPress={() => setShowModal(true)}
        />
      </View>

      {/* ⚠️ Confirmation Modal */}
      <Modal visible={showModal} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Block User</Text>
            <Text style={styles.modalDesc}>
              Are you sure you want to block{" "}
              <Text style={{ fontFamily: fonts.name.semibold }}>{user.name}</Text>?
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleBlockUser}
              >
                <Text style={styles.confirmText}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    padding: 15,
    
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  label: {
    marginLeft: 8,
    marginTop: 5,
    fontFamily: fonts.name.regular,
    fontSize: fonts.size._12px,
    color: colors.Form_InputLableCOLOR,
  },

  value: {
    marginLeft: 28,
    fontFamily: fonts.name.semibold,
    fontSize: fonts.size._14px,
    color: colors.Form_InputCOLOR,
  },

  blockBtn: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    marginHorizontal: 15,
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  blockText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: fonts.size._16px,
    fontFamily: fonts.name.semibold,
    color: colors.Form_InputCOLOR,
  },

  modalDesc: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular,
    color: colors.Form_InputLableCOLOR,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },

  cancelBtn: {
    marginRight: 10,
    padding: 10,
  },

  cancelText: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
    color: colors.Form_InputLableCOLOR,
  },

  confirmBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },

  confirmText: {
    color: "#fff",
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
  },
});