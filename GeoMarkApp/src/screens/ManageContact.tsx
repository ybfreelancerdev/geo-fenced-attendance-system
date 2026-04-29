import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Header from "../components/Header";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone is required")
    .min(10, "Enter valid phone"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  website: Yup.string()
    .url("Invalid URL")
    .required("Website is required"),
});

const ManageContact = ({ navigation }: any) => {
  const [initialValues, setInitialValues] = useState({
    phone: "",
    email: "",
    address: "",
    website: "",
  });

  // 🔥 Simulate API fetch
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        phone: "9876543210",
        email: "support@geomark.com",
        address: "Ahmedabad, Gujarat, India",
        website: "https://geomark.com",
      };

      setInitialValues(data);
    };

    fetchData();
  }, []);

  const handleSubmitForm = (values: any) => {
    console.log("Updated Contact Info:", values);
    // 👉 Call API here
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <Header title="Manage Contact Info" navigation={navigation} showBackIcon/>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            
            {/* Phone */}
            <View style={{marginVertical: 10}}>
                <AppInput
                label="Phone"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                icon="phone"
                error={errors.phone}
                touched={touched.phone}
                />
            </View>

            {/* Email */}
            <View style={{marginVertical: 10}}>
                <AppInput
                label="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="Enter email"
                keyboardType="email-address"
                icon="email"
                error={errors.email}
                touched={touched.email}
                />
            </View>

            {/* Address */}
            <View style={{marginVertical: 10}}>
                <AppInput
                label="Address"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                placeholder="Enter address"
                icon="location-on"
                error={errors.address}
                touched={touched.address}
                multiline
                numberOfLines={3}
                style={{ height: 80 }}
                />
            </View>

            {/* Website */}
            <View style={{marginVertical: 10}}>
                <AppInput
                label="Website"
                value={values.website}
                onChangeText={handleChange("website")}
                onBlur={handleBlur("website")}
                placeholder="https://example.com"
                keyboardType="url"
                icon="language"
                error={errors.website}
                touched={touched.website}
                />
            </View>

            {/* Save Button */}
            <AppButton
              title="Save Changes"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={{ marginTop: 20 }}
            />

          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default ManageContact;