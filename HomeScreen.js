// screens/HomeScreen.js — Tela 1: Lista de Gastos
// Exibe o total acumulado, a lista de gastos e botões de excluir e adicionar

import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

export default function HomeScreen({ navigation, expenses, deleteExpense }) {
  const total = expenses.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const renderItem = ({ item, index }) => (
    <View
      style={[styles.expenseItem, index % 2 === 0 && styles.expenseItemAlt]}
    >
      <View style={styles.expenseInfo}>
        {/* Emoji da categoria ou inicial da descrição */}
        <View
          style={[
            styles.expenseIcon,
            item.category && { backgroundColor: item.category.color + "33" },
          ]}
        >
          <Text style={styles.expenseIconText}>
            {item.category
              ? item.category.emoji
              : item.description.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.expenseTextGroup}>
          <Text style={styles.expenseDescription} numberOfLines={1}>
            {item.description}
          </Text>
          {item.category && (
            <Text style={styles.expenseCategory}>{item.category.label}</Text>
          )}
          <Text style={styles.expenseValue}>{formatCurrency(item.value)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteExpense(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💸</Text>
      <Text style={styles.emptyTitle}>Nenhum gasto ainda</Text>
      <Text style={styles.emptySubtitle}>
        Toque em "Novo Gasto" para começar a registrar
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* ─── Cabeçalho ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Caderneta de Gastos</Text>
            <Text style={styles.headerSubtitle}>
              Controle seus gastos com facilidade
            </Text>
          </View>
          {/* Botão Dashboard */}
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => navigation.navigate("Dashboard")}
            activeOpacity={0.8}
          >
            <Text style={styles.dashboardButtonText}>📊</Text>
          </TouchableOpacity>
        </View>

        {/* Card de total acumulado */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total gasto</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          <Text style={styles.totalCount}>
            {expenses.length} {expenses.length === 1 ? "registro" : "registros"}
          </Text>
        </View>
      </View>

      {/* ─── Lista de gastos ────────────────────────────────────── */}
      <View style={styles.listSection}>
        <Text style={styles.listSectionTitle}>Seus Gastos</Text>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyList />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            expenses.length === 0
              ? styles.flatListEmpty
              : styles.flatListContent
          }
        />
      </View>

      {/* ─── FAB — Novo Gasto ────────────────────────────────────── */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddExpense")}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>＋</Text>
          <Text style={styles.fabText}>Novo Gasto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },

  // ─── Cabeçalho ───────────────────────────────────────────────
  header: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8888aa",
    marginTop: 2,
  },
  dashboardButton: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  dashboardButtonText: {
    fontSize: 22,
  },

  // ─── Card do total ────────────────────────────────────────────
  totalCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#0f3460",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  totalLabel: {
    fontSize: 13,
    color: "#8888aa",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#e94560",
    letterSpacing: -0.5,
  },
  totalCount: {
    fontSize: 12,
    color: "#555577",
    marginTop: 6,
  },

  // ─── Seção da lista ───────────────────────────────────────────
  listSection: {
    flex: 1,
    backgroundColor: "#f0f0f7",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  flatListEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },

  // ─── Item da lista ────────────────────────────────────────────
  expenseItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  expenseItemAlt: {
    backgroundColor: "#fafafe",
  },
  expenseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  expenseIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  expenseIconText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#e94560",
  },
  expenseTextGroup: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 1,
  },
  expenseCategory: {
    fontSize: 11,
    color: "#9999bb",
    fontWeight: "500",
    marginBottom: 2,
  },
  expenseValue: {
    fontSize: 14,
    color: "#e94560",
    fontWeight: "700",
  },

  // ─── Botão de excluir ─────────────────────────────────────────
  deleteButton: {
    backgroundColor: "#fff0f3",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ffd6dd",
  },
  deleteButtonText: {
    color: "#e94560",
    fontSize: 13,
    fontWeight: "700",
  },

  // ─── Lista vazia ──────────────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9999bb",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 30,
  },

  // ─── FAB ──────────────────────────────────────────────────────
  fabContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  fab: {
    backgroundColor: "#e94560",
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  fabIcon: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginRight: 8,
    lineHeight: 24,
  },
  fabText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
