import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Define the type for navigation
type NavigationProps = DrawerNavigationProp<any>;

const CustomHeader: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name='menu' size={30}/>
            </TouchableOpacity>
            <Image
                source={require('../../assets/images/misesa.png')} // Replace with your logo path
                style={styles.logo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 70, // Adjust height as needed
        backgroundColor: 'white',
        padding: 10
    },
   
    logo: {
        width: 100, // Adjust width as needed
        height: 58, // Adjust height as needed
        
    },
});

export default CustomHeader;
