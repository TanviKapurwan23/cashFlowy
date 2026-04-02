import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const savedExpenses = await AsyncStorage.getItem("expenses");
      if (savedExpenses !== null) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.log("Error loading expenses", error);
    }
  };

  useEffect(() => {
    saveExpenses();
  }, [expenses]);

  const flatListRef = useRef(null);

  const categoryIcons: any = {
    Food: "fast-food-outline",
    Shopping: "cart-outline",
    Gym: "barbell-outline",
    Travel: "airplane-outline",
    Fun: "game-controller-outline",
    Transport: "car-outline",
  };

  const saveExpenses = async () => {
    try {
      await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (error) {
      console.log("Error saving expenses", error);
    }
  };
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );
  const deleteExpense = (id: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedExpenses = expenses.filter((item) => item.id !== id);
            setExpenses(updatedExpenses);
          },
        },
      ],
    );
  };

  const handleAddExpense = () => {
    setCategory("");
    if (!amount || !category || isNaN(Number(amount))) return;

    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    const newExpense = {
      id: Date.now().toString(),
      amount,
      category,
    };

    setExpenses([newExpense, ...expenses]);
    setAmount("");
    setCategory("");
    Keyboard.dismiss();
  };
  const categories = ["Food", "Shopping", "Gym", "Travel", "Fun", "Transport"];

  return (
    // <View style={styles.container}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cash Flowy</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Spent</Text>
        <Text style={styles.cardAmount}>₹{totalExpense.toLocaleString()}</Text>
      </View>

      <TextInput
        placeholder="Enter Amount"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        onSubmitEditing={Keyboard.dismiss}
      />
      <View>
        <Text style={styles.label}>Select Category</Text>
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category === item && styles.selectedCategory,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Other category (optional)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ref={flatListRef}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={categoryIcons[item.category] || "pricetag-outline"}
                  size={18}
                  color="#333"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.expenseCategory}>{item.category}</Text>
              </View>

              <Text style={styles.expenseAmount}>
                ₹{Number(item.amount).toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={40} color="#999" />
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubText}>
              Start tracking your spending
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },

  emptySubText: {
    color: "#777",
    marginTop: 4,
  },
  expenseCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  expenseCategory: {
    fontSize: 16,
    fontWeight: "600",
  },

  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 16,
    color: "#666",
  },

  cardAmount: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  selectedCategoryText: {
    color: "white",
  },

  selectedCategory: {
    backgroundColor: "black",
  },
  label: {
    fontSize: 14,
    margin: 6,
    fontWeight: "600",
    marginBottom: 6,
    color: "#555",
  },

  categoryButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  categoryText: {
    color: "#333",
  },
  container: {
    flex: 1,
    margin: 30,
    marginTop: 60,
    padding: 20,
    paddingTop: 50,
  },
  delete: {
    color: "red",
    fontWeight: "bold",
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
