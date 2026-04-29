import React, { useState, useMemo, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../components/Header";
import * as colors from "../styles/colors";
import fonts from '../constants/fonts';
import { userList } from "../services/apiService";
import { formatEventDateTime } from "../utils/dateUtils";

const Users = ({ navigation }: any) => {
    const [users, setUsers] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
    const [sort, setSort] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchUsers(1, true);
    }, [search, filter, sort]);

    const fetchUsers = async (pageNumber = 1, isRefresh = false) => {
        if (loading || (!hasMore && !isRefresh)) return;

        setLoading(true);

        try {
            const payload = {
                pageNumber,
                pageSize: 20,
                search,
                sortBy: "Name",
                sortDirection: sort,
                status: filter,
            };

            let newData: any[] = [];
            let res = await userList(payload);
            if (res && res.success) {
                newData = res.data.data;
            }

            setUsers(prev =>
                isRefresh ? newData : [...prev, ...newData]
            );

            setHasMore(newData.length === 20);
            setPage(pageNumber);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchUsers(page + 1);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setHasMore(true);
        fetchUsers(1, true);
    };

    const renderUser = ({ item }: any) => (
        <TouchableOpacity activeOpacity={0.5} style={styles.card}
            onPress={() => navigation.navigate('UserDetails', {
                user: item,
            })}>
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.email}>{item.phone}</Text>
                <Text style={styles.email}>{formatEventDateTime(item.createdAt).full}</Text>
            </View>

            <View
                style={[
                    styles.statusBadge,
                    {
                        backgroundColor:
                            item.status === "active" ? "#E6F9F0" : "#FEE2E2",
                    },
                ]}
            >
                <Text
                    style={{
                        color: item.status === "active" ? "#059669" : "#DC2626",
                        fontFamily: fonts.name.regular,
                        fontSize: fonts.size._12px,
                    }}
                >
                    {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Header title="Users" navigation={navigation} />

            {/* 🔍 Search */}
            <View style={styles.searchBox}>
                <MaterialIcons name="search" size={20} color={colors.Form_PlaceholderColor} />
                <TextInput
                    placeholder="Search users..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor={colors.Form_PlaceholderColor}
                    style={{
                        fontFamily: fonts.name.regular,
                        fontSize: fonts.size._14px,
                        color: colors.Form_InputCOLOR,
                        marginLeft: 10,
                        flex: 1,
                        marginTop: 5,
                    }}
                />
            </View>

            {/* 🔘 Filter + Sort */}
            <View style={styles.filterRow}>

                {/* Filter */}
                <View style={styles.filterGroup}>
                    {["all", "active", "inactive"].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.filterBtn,
                                filter === item && styles.activeFilter,
                            ]}
                            onPress={() => setFilter(item as any)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    filter === item && styles.activeFilterText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sort */}
                <TouchableOpacity
                    style={styles.sortBtn}
                    onPress={() => setSort(sort === "asc" ? "desc" : "asc")}
                >
                    <MaterialIcons name="sort" size={18} color={colors.APP_COLOR} />
                    <Text style={{
                        marginLeft: 5,
                        fontFamily: fonts.name.regular,
                        fontSize: fonts.size._12px,
                        color: colors.Form_InputCOLOR,
                    }}>
                        {sort === "asc" ? "A-Z" : "Z-A"}
                    </Text>
                </TouchableOpacity>
            </View>

            {loading && users.length === 0 && (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator color={colors.APP_COLOR} size={"large"} />
                </View>
            )}

            {/* 📋 List */}
            <View style={{flex:1, paddingBottom: 5}}>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderUser}
                    contentContainerStyle={{ marginHorizontal: 15, marginTop: 10, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}

                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}

                    refreshing={refreshing}
                    onRefresh={onRefresh}

                    ListFooterComponent={
                        loading && users.length > 0 ? (
                            <ActivityIndicator color={colors.APP_COLOR} size={"small"} style={{ marginBottom: 20, marginTop: 5 }} />
                        ) : null
                    }

                    ListEmptyComponent={
                        !loading ? (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{
                                    textAlign: "center", fontFamily: fonts.name.regular,
                                    fontSize: fonts.size._14px
                                }}>
                                    User not found
                                </Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        </View>
    );
};

export default Users;

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        margin: 15,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        borderColor: colors.Form_BorderColor,
        borderWidth: 1,
    },

    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 15,
        alignItems: "center",
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: colors.Form_BorderColor
    },

    filterGroup: {
        flexDirection: "row",
    },

    filterBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 8,
        marginRight: 5,
    },

    activeFilter: {
        backgroundColor: colors.APP_COLOR,
    },

    filterText: {
        fontFamily: fonts.name.regular,
        fontSize: fonts.size._12px,
        color: colors.Form_InputCOLOR,
    },

    activeFilterText: {
        color: "#fff",
    },

    sortBtn: {
        flexDirection: "row",
        alignItems: "center",
    },

    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },

    name: {
        fontFamily: fonts.name.semibold,
        fontSize: fonts.size._14px,
        color: colors.Form_InputCOLOR,
    },

    email: {
        fontFamily: fonts.name.regular,
        fontSize: fonts.size._12px,
        color: colors.Form_InputLableCOLOR,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
});