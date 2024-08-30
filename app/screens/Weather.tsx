import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../API';


const WeatherScreen: React.FC = () => {
    const [pesticides, setPesticides] = useState<any[]>([]);
    const [diseases, setDiseases] = useState<any[]>([]);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPesticides = async () => {
            try {
                const response = await fetch(`${BASE_URL}/pesticides`);
                const data = await response.json();
                setPesticides(data);
            } catch (error) {
                console.error('Error fetching pesticides:', error);
            }
        };

        const fetchDiseases = async () => {
            try {
                const response = await fetch(`${BASE_URL}/notifications`);
                const data = await response.json();
                setDiseases(data);
            } catch (error) {
                console.error('Error fetching diseases:', error);
            }
        };

        fetchPesticides();
        fetchDiseases();
    }, []);

    const currentWeather = 'dry';

    const filteredPesticides = (diseaseName: string) => {
        return pesticides.filter(pesticide => pesticide.type === diseaseName && pesticide.application_time.toLowerCase() === currentWeather.toLowerCase());
    };

    const renderHeader = (section: any, index: number, isActive: boolean) => {
        return (
            <View style={styles.accordionHeader}>
                <Text style={styles.diseaseName}>{section.name}</Text>
                <Ionicons name={isActive ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
            </View>
        );
    };

    const renderContent = (section: any) => {
        return (
            <View style={styles.accordionContent}>
                {filteredPesticides(section.name).map((pesticide, index) => (
                    <View key={index} style={styles.pesticideItem}>
                        <Text>{pesticide.name}</Text>
                        <Text style={{ color: 'green' }}>
                            Recommended for {currentWeather} conditions
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    const updateSections = (activeSections: number[]) => {
        setActiveSections(activeSections);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Existing weather components */}
            <View style={styles.header}>
                <Text style={styles.location}>Blantyre, 29 Jul</Text>
                <Text style={styles.temperature}>16°C</Text>
                <Text style={styles.details}>32°C / 17°C</Text>
                <Text style={styles.details}>{currentWeather}</Text>
                <Text style={styles.sunset}>Sunset 5:29 PM</Text>
            </View>
            <View style={styles.iconContainer}>
                <Ionicons name="moon" type="feather" size={100} color="#b0c4de" />
                <Text style={styles.percentage}>0%</Text>
            </View>
            <View style={styles.sprayingTime}>
                <Text style={styles.sectionTitle}>Spraying time</Text>
                <View style={styles.sprayingConditions}>
                    <Text>Best time to spray crops based on weather conditions</Text>
                    <View style={styles.conditionIcons}>
                        {['Now', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM', '1 AM', '2 AM', '3 AM'].map((time, index) => (
                            <View key={index} style={styles.conditionIcon}>
                                <Ionicons name="close" type="feather" size={24} color="red" />
                                <Text>{time}</Text>
                            </View>
                        ))}

                        
                    </View>
                    <Text style={styles.favColor}>Unfavourable Condition</Text>
                </View>
            </View>
            <View style={styles.forecast}>
                <Text style={styles.sectionTitle}>Next 6 days</Text>
                <View style={styles.forecastDays}>
                    {[
                        { day: 'Tue', temp: '30°C' },
                        { day: 'Wed', temp: '30°C' },
                        { day: 'Thu', temp: '28°C' },
                        { day: 'Fri', temp: '28°C' },
                        { day: 'Sat', temp: '30°C' },
                        { day: 'Sun', temp: '31°C' },
                    ].map((forecast, index) => (
                        <View key={index} style={styles.forecastDay}>
                            <Ionicons name="ellipse" type="feather" size={24} color="orange" />
                            <Text>{forecast.day}</Text>
                            <Text>{forecast.temp}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Disease and Pesticide recommendation accordion */}
            <View style={styles.pesticideRecommendations}>
                <Text style={styles.sectionTitle}>Detected Diseases and Pesticide Application timing</Text>
                <Accordion
                    sections={diseases}
                    activeSections={activeSections}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={updateSections}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f8ff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    location: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    temperature: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 16,
        color: '#888',
    },
    sunset: {
        fontSize: 16,
        color: '#888',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    percentage: {
        fontSize: 20,
        color: '#888',
    },
    sprayingTime: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sprayingConditions: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    conditionIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    conditionIcon: {
        alignItems: 'center',
    },
    favColor: {
        backgroundColor: '#FF000060',
        padding: 10,
        textAlign: 'center',
        margin: 10,
        borderRadius: 20,
    },
    forecast: {
        marginBottom: 20,
    },
    forecastDays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    forecastDay: {
        alignItems: 'center',
    },
    pesticideRecommendations: {
        marginBottom: 20,
    },
    accordionHeader: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
    },
    accordionContent: {
        padding: 14,
        margin: 6,
        backgroundColor: '#fff',
        borderRadius: 5,
        fontSize: 19
    },
    diseaseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pesticideItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});

export default WeatherScreen;
