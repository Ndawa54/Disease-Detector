import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Analytics from './screens/AnalyticsScreen';
import ButtomTabs from './ButtomTabs';
import Profile from './screens/ProfileScreens';
import LogOut from './screens/LogOut';
import CustomHeader from './CustomeDrawer'; // Import the custom header component
import WeatherScreen from './screens/Weather';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                header: () => <CustomHeader />, // Use the custom header component here
            }}
        >
            <Drawer.Screen
                name="Kulima Bette"
                component={ButtomTabs}
                options={{
                    drawerLabel: 'Home',
                }}
            />
            <Drawer.Screen name="Analytics" component={Analytics} />
            <Drawer.Screen name="Weather" component={WeatherScreen} />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="LogOut" component={LogOut} />
            
        </Drawer.Navigator>
    );
}
