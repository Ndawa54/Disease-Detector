import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Analytics({ navigation }: any) {
    // Sample data for the charts
    const weedDiseaseData = {
        labels: ["Fungi", "Rusts", "ArmyWorm", "Disease 2"],
        datasets: [
            {
                data: [20, 45, 28, 80],
            },
        ],
    };

    const rainfallData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                data: [0, 0, 20, 50, 0, 0, 10],
            },
        ],
    };

    const frequentDetectionData = [
        {
            name: "Chisoso",
            population: 50,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "Fungi",
            population: 30,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "Rust",
            population: 20,
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "Disease 2",
            population: 40,
            color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
    ];

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientTo: "#08130D",
        color: (opacity = 1) => `rgba(26, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 1,
        useShadowColorFromDataset: false, // optional
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Weeds & Diseases Detected</Text>
            <BarChart
                style={styles.chart}
                data={weedDiseaseData}
                width={screenWidth - 20}
                height={250}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                yAxisLabel="" // Add this prop
                yAxisSuffix="" // Add this prop
            />

            <Text style={styles.title}>Expected Rainfall</Text>
            <LineChart
                style={styles.chart}
                data={rainfallData}
                width={screenWidth - 20}
                height={220}
                chartConfig={chartConfig}
                bezier
            />

            <Text style={styles.title}>Most Frequently Detected</Text>
            <PieChart
                style={styles.chart}
                data={frequentDetectionData}
                width={screenWidth - 20}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    chart: {
        marginVertical: 10,
        borderRadius: 16,
    },
});
