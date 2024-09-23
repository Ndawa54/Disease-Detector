import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";

export default function Task() {
    const [filter, setFilter] = useState('all'); // State to handle the selected filter
    const [modalVisible, setModalVisible] = useState(false); // State to handle dropdown visibility

    // Data for tasks (you can replace it with dynamic data later)
    const tasks = [
        { id: 1, name: "Rusts", criticality: "high" },
        { id: 2, name: "Task", criticality: "medium" },
        { id: 3, name: "Task", criticality: "low" },
        { id: 4, name: "Rusts", criticality: "high" },
        { id: 5, name: "Task", criticality: "medium" },
        { id: 6, name: "Rusts", criticality: "high" },
        { id: 7, name: "Task", criticality: "low" },
    ];

    // Filter function
    const filteredTasks = tasks.filter(task => filter === 'all' || task.criticality === filter);

    return (
        <ScrollView style={styles.container}>
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
                    {/* <Text style={styles.legendText}>Legend:</Text> */}
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FF8A80' }]} />
                        <Text style={styles.legendLabel}>High </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FFD54F' }]} />
                        <Text style={styles.legendLabel}>Medium </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#81C784' }]} />
                        <Text style={styles.legendLabel}>Low </Text>
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
                <View key={task.id} style={styles[task.criticality]}>
                    <Text style={styles.title}>{task.name}</Text>
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
