// App.js — Ponto de entrada do aplicativo
// Configura o NavigationContainer e o Stack Navigator

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import DashboardScreen from "./screens/DashboardScreen";

// Criação do stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  // Estado global da lista de gastos — compartilhado entre as telas
  const [expenses, setExpenses] = useState([]);

  // Função para adicionar um novo gasto (chamada pela Tela 2)
  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, { ...expense, id: Date.now().toString() }]);
  };

  // Função para excluir um gasto pelo id (chamada pela Tela 1)
  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Tela 1 — Lista de Gastos */}
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              expenses={expenses}
              deleteExpense={deleteExpense}
            />
          )}
        </Stack.Screen>

        {/* Tela 2 — Formulário de Novo Gasto */}
        <Stack.Screen name="AddExpense">
          {(props) => <AddExpenseScreen {...props} addExpense={addExpense} />}
        </Stack.Screen>

        {/* Tela 3 — Dashboard de Categorias */}
        <Stack.Screen name="Dashboard">
          {(props) => <DashboardScreen {...props} expenses={expenses} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
