import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Directions } from "react-native-gesture-handler";
import { JumpingTransition } from "react-native-reanimated";

const img = require('../../assets/images/dark.jpg')
const h_img = require('../../assets/images/images.jpg')

export default function Home({ navigation }: any) {
    const [diseaseCount, setDiseaseCount] = useState(0);
    const [weedCount, setWeedCount] = useState(0);

    const fetchData = async () => {
        const response = await fetch(`http://192.168.91.123:8000/api/notification-counts`);
        const result = await response.json();

        setDiseaseCount(result.diseases);
        setWeedCount(result.weeds);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>


            <View>
                <ImageBackground source={h_img} style={styles.headerImage}>
                    <View style={styles.overlay}>
                        <Text style={styles.welcomeHeader}>Welcome to Smart Farm Tech</Text>
                        <Text style={styles.headerDescription}>
                            Improving farm productivity with advanced weed and disease detection technology.
                        </Text>
                    </View>
                </ImageBackground>
            </View>

            <Pressable onPress={() => {
                navigation.jumpTo('Weather')
            }}>
                <View style={styles.card}>
                    {/* <ImageBackground
                        source={img}
                        resizeMode="cover"
                        style={styles.image}
                    > */}
                    <Text style={styles.textHeader}>Blantyre, 29 Jul</Text>

                    <View style={styles.iconContainer}>
                        <Ionicons name="cloudy" size={28} color='black' />
                        <Text style={styles.textCloud}>Cloudy</Text>
                    </View>
                    <Text style={styles.degrees}>16°C</Text>
                    {/* </ImageBackground> */}
                </View>
            </Pressable>

            <View style={styles.alerts}>
                <Text style={styles.mainHeader}>🔔 Alerts</Text>
                <Text style={styles.diseaseAlert}> 🍂 {diseaseCount} disease detections</Text>
                <Text style={styles.weedAlert}> 🌾 {weedCount} weed detections</Text>
            </View>

            <View style={styles.features}>
                <Text style={styles.mainHeader}>Key Features</Text>
                <View style={styles.ftIcons}>
                    <View style={styles.iconFeatures}>
                        <Ionicons name="camera" size={40} />
                        <Text style={styles.direction}>
                            Disease Detection
                        </Text>
                    </View>
                    <Pressable onPress={() => {
                        navigation.jumpTo("Analytics")
                    }}>
                        <View style={styles.iconFeatures}>
                            <Ionicons name="stats-chart" size={40} color='red' />
                            <Text style={styles.direction}>
                                Analytics
                            </Text>
                        </View>
                    </Pressable>

                </View>
                <View style={styles.ftIcons}>

                    <Pressable onPress={() => {
                        navigation.jumpTo("Weather")
                    }}>
                        <View style={styles.iconFeatures}>
                            <Ionicons name="partly-sunny" size={40} color='orange' />
                            <Text style={styles.direction}>
                                Weather Forecast
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => {
                        navigation.navigate('Camera')
                    }}>
                        <View style={styles.iconFeatures}>
                            <Ionicons name="leaf" size={40} color='green' />
                            <Text style={styles.direction}>
                                Detection
                            </Text>
                        </View>
                    </Pressable>
                </View>


            </View>

        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },

    headerImage: {
        width: '100%',
        height: 200, // Adjust as needed
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for readability
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    welcomeHeader: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        padding: 10,
        marginTop: 20,
        color: '#fff'
    },
    headerDescription: {
        fontSize: 17,
        textAlign: 'center',
        padding: 14,
        color: '#fff'
    },
    card: {

        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 30,
        elevation: 10,
        margin: 16,
        overflow: 'hidden'

    },
    textHeader: {
        fontSize: 18,
        textAlign: 'center',
        // color: 'white'
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        marginTop: 20


    },
    textCloud: {
        fontSize: 20,
        fontWeight: 'bold',
        // color: 'white'
    },
    degrees: {
        fontSize: 60,
        marginTop: 8,
        marginBottom: 8,
        // color: 'white'

    },
    image: {
        width: " 100%",
    },
    alerts: {
        padding: 15,
        margin: 2
    },
    mainHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    diseaseAlert: {
        backgroundColor: '#fde8e8',
        padding: 20,
        fontSize: 18,
        borderRadius: 10,
        marginVertical: 12,
        color: '#B71C1C'
    },
    weedAlert: {
        backgroundColor: '#81C784',
        padding: 20,
        fontSize: 18,
        borderRadius: 10,
        color: '#2E7D32'
    },
    features: {
        padding: 15,
        margin: 2
    },
    ftIcons: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between'
    },
    iconFeatures: {
        backgroundColor: '#fff',
        padding: 50,
        borderRadius: 10,
        elevation: 10

    },
    direction: {
        position: 'absolute',
        left: 20,
        top: 100,
        width: 100,
        textAlign: 'center'
    }
})