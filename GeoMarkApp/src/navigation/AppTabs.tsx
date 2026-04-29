import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as colors from "../styles/colors";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UpcomingEvents from '../screens/Events';
import MyEvents from '../screens/MyEvents';
import MyProfile from '../screens/MyProfile';
import { ActivityIndicator, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { roleSessionKey } from '../constants';
import AdminHome from '../screens/AdminHome';
import Users from '../screens/Users';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem(roleSessionKey);
      setRole(storedRole);
    };

    getRole();
  }, []);

  if (role === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.APP_COLOR} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarSafeAreaInset: { bottom: 'always' },
        tabBarActiveTintColor: colors.APP_COLOR,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          paddingTop: 5,
          // height: 70,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          height: 50 + insets.bottom,   // ⬅️ add safe bottom inset dynamically
          // paddingBottom: insets.bottom, // ⬅️ push icons above nav buttons
        },
        tabBarLabelStyle: {
          marginTop: -2,
          fontSize: 10
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: 'transparent' }}
          >
            {props.children}
          </Pressable>
        ),
      })}
    >
      <Tab.Screen name="Home" component={role === "Admin" ? AdminHome : Home}
        options={({ navigation }) => ({
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={25} color={color} />
          ),
        })}
      />
      <Tab.Screen name="Events" component={UpcomingEvents}
        options={({ navigation }) => ({
          title: "Events",
          tabBarLabel: "Events",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event-note" size={25} color={color} />
          ),
        })}
      />
      {
        role === "Admin" ?
          <Tab.Screen name="Users" component={Users}
            options={({ navigation }) => ({
              title: "Users",
              tabBarLabel: "Users",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="groups" size={25} color={color} />
              ),
            })}
          />
          :
          <Tab.Screen name="MyEvents" component={MyEvents}
            options={({ navigation }) => ({
              title: "My Events",
              tabBarLabel: "My Events",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="event-available" size={25} color={color} />
              ),
            })}
          />
      }
      
      <Tab.Screen name="MyProfile" component={MyProfile}
        options={({ navigation }) => ({
          title: "My Profile",
          tabBarLabel: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={25} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}