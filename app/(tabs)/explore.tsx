import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
const screenWidth = Dimensions.get("window").width;

export default function ExploreScreen() {
  const [chartData, setChartData] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, []),
  );

  const loadExpenses = async () => {
    const savedExpenses = await AsyncStorage.getItem("expenses");

    if (!savedExpenses) return;

    const expenses = JSON.parse(savedExpenses);

    const categoryTotals: any = {};

    expenses.forEach((item: any) => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0;
      }
      categoryTotals[item.category] += Number(item.amount);
    });

    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4CAF50",
      "#9C27B0",
      "#FF9800",
    ];

    const formattedData = Object.keys(categoryTotals)
      .filter((category) => categoryTotals[category] > 100)
      .map((category, index) => ({
        name: category,
        amount: categoryTotals[category],
        color: colors[index % colors.length],
        legendFontColor: "#333",
        legendFontSize: 14,
      }));

    setChartData(formattedData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Analytics</Text>

      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth}
          height={220}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="10"
          chartConfig={{
            color: () => "#000",
          }}
        />
      ) : (
        <Text>No data yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
