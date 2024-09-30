import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Modal, Pressable, RefreshControl } from "react-native";
import BASE_URL from "../API";

export default function Task() {
    const [filter, setFilter] = useState('all'); // State to handle the selected filter
    const [modalVisible, setModalVisible] = useState(false); // State to handle dropdown visibility
    const [notifications, setNotifications] = useState<Notification[]>([]); // State for notifications fetched from API
    const [criticals, setCriticals] = useState<Critical[]>([]); // State for critical levels fetched from API
    const [isRefreshing, setIsRefreshing] = useState(false); // State for refreshing

    interface Notification {
        id: number;
        name: string;
    }

    interface Critical {
        name: string;
        critical_level: string;
    }

    // Fetch notifications from the notifications table
    const fetchNotifications = async () => {
        setIsRefreshing(true); // Set refreshing to true when fetching data
        try {
            const response = await fetch(`${BASE_URL}/notifications`); // Replace with your API endpoint
            const data = await response.json();
            setNotifications(data); // Assuming data is an array of notification objects
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch critical levels from the criticals table
    const fetchCriticals = async () => {
        try {
            const response = await fetch(`${BASE_URL}/criticals`); // Replace with your API endpoint
            const data = await response.json();
            setCriticals(data); // Assuming data is an array of critical objects
        } catch (error) {
            console.error('Error fetching criticals:', error);
        } finally {
            setIsRefreshing(false); // Set refreshing to false after fetching data
        }
    };

    useEffect(() => {
        fetchNotifications(); // Fetch notifications on component mount
        fetchCriticals(); // Fetch critical levels on component mount
    }, []); // Empty dependency array to run once on component mount

    // Group notifications by name and count occurrences
    const groupedNotifications = notifications.reduce<{ [key: string]: { name: string; count: number } }>(
        (acc, notification) => {
            if (acc[notification.name]) {
                acc[notification.name].count += 1;
            } else {
                acc[notification.name] = { name: notification.name, count: 1 };
            }
            return acc;
        },
        {}
    );

    // Convert grouped notifications into an array for rendering
    const groupedNotificationsArray = Object.values(groupedNotifications);

    // Merge notifications with their critical levels
    const mergedTasks = groupedNotificationsArray.map((notification) => {
        const criticalInfo = criticals.find(critical => critical.name === notification.name) || { critical_level: 'low' }; // Default to 'low' if no match
        return { ...notification, critical_level: criticalInfo.critical_level };
    });

    // Filter tasks based on selected critical level
    const filteredTasks = mergedTasks.filter(task => filter === 'all' || task.critical_level.toLowerCase() === filter);

    return (
        <ScrollView 
            style={styles.container} 
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={() => { fetchNotifications(); fetchCriticals(); }} />
            }
        >
            {/* Filter and Legend Container */}
            <View style={styles.topContainer}>
                {/* Filter Dropdown Button */}
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.dropdownButton}
                >
                    <Ionicons name="filter" size={20} style={styles.filterIcon} />
                    <Text>Filter Tasks</Text>
                </TouchableOpacity>

                {/* Legend */}
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FF8A80' }]} />
                        <Text style={styles.legendLabel}>High</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FFD54F' }]} />
                        <Text style={styles.legendLabel}>Medium</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#81C784' }]} />
                        <Text style={styles.legendLabel}>Low</Text>
                    </View>
                </View>
            </View>

            {/* Modal for Dropdown */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Pressable
                            onPress={() => { setFilter('all'); setModalVisible(false); }}
                            style={styles.modalOption}
                        >
                            <Text>All</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { setFilter('high'); setModalVisible(false); }}
                            style={styles.modalOption}
                        >
                            <Text>High</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { setFilter('medium'); setModalVisible(false); }}
                            style={styles.modalOption}
                        >
                            <Text>Medium</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { setFilter('low'); setModalVisible(false); }}
                            style={styles.modalOption}
                        >
                            <Text>Low</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Task List */}
            {filteredTasks.map(task => (
                <View key={task.name} style={styles[task.critical_level]}>
                    {/* Display the task name along with the total count */}
                    <Text style={styles.title}>{task.name} ({task.count})</Text>
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flexDirection: 'row', // Align elements in a row
        justifyContent: 'space-between', // Space between filter and legend
        alignItems: 'center',
        margin: 6,
        marginHorizontal: 23,
        padding: 10,
    },
    legend: {
        flex: 1,
        paddingLeft: 130,
    },
    legendText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    legendColor: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    legendLabel: {
        fontSize: 14,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 15,
        backgroundColor: '#EEE',
        borderRadius: 10,
    },
    filterIcon: {
        marginRight: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 250,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalOption: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
    high: {
        backgroundColor: '#FF8A80',
        padding: 30,
        margin: 15,
        borderRadius: 10,
    },
    medium: {
        backgroundColor: '#FFD54F',
        padding: 30,
        margin: 15,
        borderRadius: 10,
    },
    low: {
        backgroundColor: '#81C784',
        padding: 30,
        margin: 15,
        borderRadius: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
    }
});
