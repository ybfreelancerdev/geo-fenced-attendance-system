import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import fonts from '../constants/fonts';
import * as colors from "../styles/colors";
import { deleteAccount } from "../services/apiService";
import { showCustom } from "../services/MessageService";
import { useAuth } from "../context/AuthContext";

const DeleteAccount = ({ navigation }: any) => {
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { logout }: any = useAuth();

    const handleDelete = async () => {
        if (!confirm) return;
        
        setLoading(true);
        try {
            let res = await deleteAccount();
            if (res && res.success) {
                showCustom(res.message);
                logout();
            }
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle={"dark-content"} />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginTop: 55 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="delete-forever" size={60} color="#EF4444" />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>Delete Account</Text>

                        {/* Warning */}
                        <Text style={styles.description}>
                            This action is permanent and cannot be undone. Deleting your account
                            will remove all your data including events, history, and profile
                            information.
                        </Text>

                        {/* Points */}
                        <View style={styles.pointsBox}>
                            <Text style={styles.point}>• Your profile will be deleted</Text>
                            <Text style={styles.point}>• All event history will be lost</Text>
                            <Text style={styles.point}>• You won’t be able to recover data</Text>
                        </View>

                        {/* Confirmation */}
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setConfirm(!confirm)}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons
                                name={confirm ? "check-box" : "check-box-outline-blank"}
                                size={22}
                                color={confirm ? "#EF4444" : "#6B7280"}
                            />
                            <Text style={styles.checkboxText}>
                                I understand the consequences and want to delete my account
                            </Text>
                        </TouchableOpacity>

                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.deleteBtn,
                                    { opacity: (confirm || loading) ? 1 : 0.5 },
                                ]}
                                disabled={!confirm || loading}
                                onPress={handleDelete}
                            >
                                {
                                    loading ?
                                        <ActivityIndicator color={'#fff'} />
                                        :
                                        <>
                                            <MaterialIcons name="delete" size={18} color="#fff" />
                                            <Text style={styles.deleteText}>Delete</Text>
                                        </>
                                }
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default DeleteAccount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    backBtn: {
        position: "absolute",
        top: 15,
        left: 20,
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 20,
        elevation: 3,
    },

    iconContainer: {
        alignItems: "center",
        marginTop: 30,
        marginBottom: 10,
    },

    title: {
        fontSize: fonts.size._22px,
        fontFamily: fonts.name.bold,
        textAlign: "center",
        color: colors.Form_InputCOLOR,
        marginBottom: 10,
        marginHorizontal: 20
    },

    description: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: colors.Form_InputLableCOLOR,
        textAlign: "center",
        lineHeight: 20,
        marginHorizontal: 20
    },

    pointsBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginVertical: 20,
        elevation: 2,
        marginHorizontal: 20
    },

    point: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.semibold,
        color: colors.Form_InputCOLOR,
        marginBottom: 6,
    },

    checkboxRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 30,
        marginHorizontal: 20,
    },

    checkboxText: {
        flex: 1,
        marginLeft: 10,
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: colors.Form_InputLableCOLOR,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },

    cancelBtn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 25,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        marginRight: 10,
    },

    cancelText: {
        fontSize: fonts.size._14px,
        fontFamily: fonts.name.semibold,
        color: colors.Form_InputLableCOLOR,
    },

    deleteBtn: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        borderRadius: 25,
        backgroundColor: "#EF4444",
    },

    deleteText: {
        fontSize: fonts.size._14px,
        fontFamily: fonts.name.semibold,
        marginLeft: 6,
        color: "#fff",
    },
});