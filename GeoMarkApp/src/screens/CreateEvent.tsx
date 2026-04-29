import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as colors from "../styles/colors";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import fonts from '../constants/fonts';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { showCustom } from "../services/MessageService";
import { createEvent, getEventDataById, updateEvent } from "../services/apiService";
import { formatEventDateTime } from "../utils/dateUtils";

const EventSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    highlights: Yup.array()
                .of(Yup.string().trim().required("Invalid highlight"))
                .min(1, "At least one highlight is required")
                .required("Highlights is required"),
    place: Yup.string().required("Place required"),
    address: Yup.string().required("Address required"),
    radius: Yup.number().required("Radius required"),
    maxMembers: Yup.number().required("Max members required"),
    eventDate: Yup.string().required("Event date required"),
});

const CreateEvent = ({ route, navigation }: any) => {
    const isEdit = route?.params?.isEdit;
    const [loading, setLoading] = useState(false);
    const formikRef = useRef<any>(null);

    const initialValues = {
        title: "",
        description: "",
        highlights: [],
        place: "",
        address: "",
        radius: "",
        maxMembers: "",
        eventDate: "",
    };

    useEffect(() => {
        if(route?.params && route?.params?.id) {
            fetchEventData(route?.params?.id);
        }
    }, [route?.params?.id]);

    const fetchEventData = async (id: number) => {
        try {
            let res = await getEventDataById(id);
            if (res && res.success) {
                formikRef.current.setFieldValue("title", res.data.title);
                formikRef.current.setFieldValue("description", res.data.description);
                formikRef.current.setFieldValue("place", res.data.place);
                formikRef.current.setFieldValue("address", res.data.address);
                formikRef.current.setFieldValue("radius", res.data.radius.toString());
                formikRef.current.setFieldValue("maxMembers", res.data.maxMembers.toString());
                formikRef.current.setFieldValue("eventDate", new Date(res.data.eventDate + "Z"));

                const highlightsArray = res.data.highlights
                    ? res.data.highlights.split(",").map((item: string) => item.trim())
                    : [];
                formikRef.current.setFieldValue("highlights", highlightsArray);
            }
        } catch (error: any) {
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const location = await getLatLng(values.address);

        if (!location) {
            setLoading(false);
            showCustom("Location not found. Try different address.");
            return;
        }
        
        const payload = {
            ...values,
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            radius: Number(values.radius),
            maxMembers: Number(values.maxMembers),
            eventDate: new Date(values.eventDate).toISOString(),
            highlights: values.highlights?.join(", "), 
        };

        if (isEdit) {
            try {
                let res = await updateEvent(route?.params?.id, payload);
                if (res && res.success) {
                    showCustom(res.message);
                    formikRef.current?.resetForm();
                    navigation.goBack();
                } else {
                    showCustom(res.message);
                }
            } catch (error: any) {
            } finally {
                setLoading(false);
            }
        } else {
            try {
                let res = await createEvent(payload);
                if (res && res.success) {
                    showCustom(res.message);
                    formikRef.current?.resetForm();
                } else {
                    showCustom(res.message);
                }
            } catch (error: any) {
            } finally {
                setLoading(false);
            }
        }
    };

    const openDatePicker = () => {
        const value = formikRef.current?.values?.eventDate;
        DateTimePickerAndroid.open({
            value: value ? value : new Date(),
            mode: 'date',
            minimumDate: new Date(),
            onChange: (event, date) => {
                if (event.type === 'dismissed') return;

                if (date) {
                    // 👉 Open time picker after date
                    openTimePicker(date);
                }
            },
        });
    };

    const openTimePicker = (date:any) => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'time',
            is24Hour: false,
            onChange: (event, time) => {
                if (event.type === 'dismissed') return;

                if (time) {
                    // 👉 Merge date + time
                    const finalDate = new Date(date);
                    finalDate.setHours(time.getHours());
                    finalDate.setMinutes(time.getMinutes());

                    // 👉 Set in Formik
                    formikRef.current.setFieldValue(
                        "eventDate",
                        finalDate.toISOString()
                    );
                }
            },
        });
    };

    const getLatLng = async (address:any) => {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address
        )}&format=json&limit=1`;

        const res = await fetch(url, {
            headers: {
                "User-Agent": "GeoMarkApp" // IMPORTANT (required by Nominatim)
            }
        });

        const data = await res.json();

        if (data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            };
        }

        return null;
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
                <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                    <Text style={styles.header}>{isEdit ? 'Edit Event' : 'Create Event'}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        validationSchema={EventSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({
                            handleChange,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            handleBlur,
                            setFieldValue
                        }) => (
                            <>
                                {/* Title */}
                                <View style={{ marginHorizontal: 20 }}>
                                    <AppInput
                                        label="Title"
                                        value={values.title}
                                        onChangeText={handleChange("title")}
                                        onBlur={handleBlur("title")}
                                        placeholder="Enter title"
                                        keyboardType="default"
                                        error={errors.title}
                                        touched={touched.title}
                                    />
                                </View>

                                {/* Description */}
                                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                    <AppInput
                                        label="Description"
                                        value={values.description}
                                        onChangeText={handleChange("description")}
                                        onBlur={handleBlur("description")}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder="Enter description"
                                        keyboardType="default"
                                        error={errors.description}
                                        touched={touched.description}
                                    />
                                </View>

                                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                    <AppInput
                                        label="Event Highlights"
                                        value={values.highlights}
                                        onChangeText={(val: any) => setFieldValue("highlights", val)}
                                        placeholder="Add highlight (press enter or comma)"
                                        type="chips"
                                        error={errors.highlights}
                                        touched={touched.highlights}
                                    />
                                </View>

                                {/* Latitude */}
                                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                    <AppInput
                                        label="Place"
                                        value={values.place}
                                        onChangeText={handleChange("place")}
                                        onBlur={handleBlur("place")}
                                        placeholder="Enter place ex. venue/building name"
                                        error={errors.place}
                                        touched={touched.place}
                                    />
                                </View>

                                {/* Longitude */}
                                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                    <AppInput
                                        label="Address"
                                        value={values.address}
                                        onChangeText={handleChange("address")}
                                        onBlur={handleBlur("address")}
                                        placeholder="Enter address ex. area, city, state"
                                        error={errors.address}
                                        touched={touched.address}
                                    />
                                </View>

                                {/* Radius */}
                                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                    <AppInput
                                        label="Radius (meters)"
                                        value={values.radius}
                                        onChangeText={handleChange("radius")}
                                        onBlur={handleBlur("radius")}
                                        placeholder="Enter radius (meters)"
                                        keyboardType="numeric"
                                        error={errors.radius}
                                        touched={touched.radius}
                                    />
                                </View>

                                {/* Max Members */}
                                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                    <AppInput
                                        label="Max Members"
                                        value={values.maxMembers}
                                        onChangeText={handleChange("maxMembers")}
                                        onBlur={handleBlur("maxMembers")}
                                        placeholder="Enter max members"
                                        keyboardType="numeric"
                                        error={errors.maxMembers}
                                        touched={touched.maxMembers}
                                    />
                                </View>

                                {/* Event Date */}
                                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => openDatePicker()}>
                                        <View pointerEvents="none">
                                            <AppInput
                                                label="Event Date"
                                                value={values.eventDate ? new Date(values.eventDate).toLocaleString() : ''}
                                                placeholder="Select event date & time"
                                                icon="event"
                                                editable={false}
                                                // onPress={() => setShowPicker(true)}
                                                error={errors.eventDate}
                                                touched={touched.eventDate}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Submit Button */}
                                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                                    <AppButton
                                        title={isEdit ? "Update Event" : "Create Event"}
                                        onPress={handleSubmit}
                                        loading={loading}
                                    />
                                </View>
                            </>
                        )}
                    </Formik>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default CreateEvent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
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
    header: {
        fontSize: fonts.size._22px,
        fontFamily: fonts.name.bold,
        color: colors.APPHeader_TextCOLOR,
        marginTop: 70
    },
});