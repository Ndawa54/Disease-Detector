import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/HomeScreen";
// import Camera from "../screens/CameraScreen";
import StackNavigation from "./Stack";
import { Ionicons } from "@expo/vector-icons";
import CameraScreen from '../screens/CameraScreen';
import Task from '../screens/Task';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const response = await fetch('http://192.168.80.123:8000/api/notifications');

        // Log the raw response to check its content
        const text = await response.text();
        console.log('Response text:', text);

        // Attempt to parse the text as JSON
        const data = JSON.parse(text);
        setNotificationCount(data.length);  // Assuming the response is an array of notifications
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Fetch notifications count on component mount
    fetchNotificationsCount();

    // Set up interval to fetch notifications count periodically
    const interval = setInterval(fetchNotificationsCount, 60000); // Fetch every 60 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Choose Camera',
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={Task}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-circle-outline" size={25} color={color} />
          ),
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined
        }}
      />
      <Tab.Screen
        name="Notification"
        component={StackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={25} color={color} />
          ),
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined
        }}
      />
    </Tab.Navigator>
  );
}
