import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import BASE_URL from '../API';

const screenWidth = Dimensions.get("window").width;

type ChartData = {
    labels: string[];
    datasets: {
        data: number[];
    }[];
};

type PieChartData = {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
}[];

export default function Analytics({ navigation }: any) {
    const [weedDiseaseData, setWeedDiseaseData] = useState<ChartData | null>(null);
    const [frequentDetectionData, setFrequentDetectionData] = useState<PieChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

    const rainfallData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                data: [30, 10, 2, 10, 0, 0, 10],
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientTo: "#08130D",
        color: (opacity = 1) => `rgba(26, 255, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 1,
        useShadowColorFromDataset: false,
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/notifications`); // Replace with your API endpoint
            const data = await response.json();

            const counts = data.reduce((acc: any, item: any) => {
                acc[item.name] = (acc[item.name] || 0) + 1;
                return acc;
            }, {});

            setWeedDiseaseData({
                labels: Object.keys(counts),
                datasets: [
                    {
                        data: Object.values(counts),
                    },
                ],
            });

            const pieData = Object.keys(counts).map((name, index) => ({
                name,
                population: counts[name],
                color: getRandomColor(index),
                legendFontColor: "#7F7F7F",
                legendFontSize: 15,
            }));

            setFrequentDetectionData(pieData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const getRandomColor = (index: number) => {
        const colors = [
            "#ff6384",
            "#36a2eb",
            "#ffcd56",
            "#4bc0c0",
            "#9966ff",
            "#ff9f40",
        ];
        return colors[index % colors.length];
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>Weeds & Diseases Detected</Text>
            {weedDiseaseData && (
                <BarChart
                    style={styles.chart}
                    data={weedDiseaseData}
                    width={screenWidth - 20}
                    height={250}
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    yAxisLabel=""
                    yAxisSuffix=""
                />
            )}

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
            {frequentDetectionData && (
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
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});
