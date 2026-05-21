// screens/DashboardScreen.js — Tela 3: Dashboard de Categorias
// Exibe totais por categoria, gráfico de barras, maior gasto e filtro de data

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
} from "react-native";
import { CATEGORIES } from "./AddExpenseScreen";

const SCREEN_WIDTH = Dimensions.get("window").width;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const formatDateDisplay = (day, month, year) =>
  `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

const toMidnight = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ─── Mini seletor de data (reutilizável) ──────────────────────────────────────
function DatePickerModal({
  visible,
  title,
  initialDay,
  initialMonth,
  initialYear,
  onConfirm,
  onCancel,
}) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [tempDay, setTempDay] = useState(initialDay);
  const [tempMonth, setTempMonth] = useState(initialMonth);
  const [tempYear, setTempYear] = useState(initialYear);

  // Sincroniza quando o modal abre com novos valores
  React.useEffect(() => {
    if (visible) {
      setTempDay(initialDay);
      setTempMonth(initialMonth);
      setTempYear(initialYear);
    }
  }, [visible, initialDay, initialMonth, initialYear]);

  const handleConfirm = () => {
    const maxDay = getDaysInMonth(tempMonth, tempYear);
    const safeDay = Math.min(tempDay, maxDay);
    onConfirm(safeDay, tempMonth, tempYear);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={dpStyles.overlay}>
        <View style={dpStyles.card}>
          <Text style={dpStyles.title}>{title}</Text>

          {/* Dia */}
          <View style={dpStyles.row}>
            <Text style={dpStyles.label}>Dia</Text>
            <View style={dpStyles.controls}>
              <TouchableOpacity
                style={dpStyles.btn}
                onPress={() => setTempDay((d) => Math.max(1, d - 1))}
              >
                <Text style={dpStyles.btnText}>‹</Text>
              </TouchableOpacity>
              <Text style={dpStyles.value}>
                {String(tempDay).padStart(2, "0")}
              </Text>
              <TouchableOpacity
                style={dpStyles.btn}
                onPress={() =>
                  setTempDay((d) =>
                    Math.min(getDaysInMonth(tempMonth, tempYear), d + 1),
                  )
                }
              >
                <Text style={dpStyles.btnText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mês */}
          <View style={dpStyles.row}>
            <Text style={dpStyles.label}>Mês</Text>
            <View style={dpStyles.controls}>
              <TouchableOpacity
                style={dpStyles.btn}
                onPress={() => setTempMonth((m) => (m <= 1 ? 12 : m - 1))}
              >
                <Text style={dpStyles.btnText}>‹</Text>
              </TouchableOpacity>
              <Text style={[dpStyles.value, dpStyles.valueWide]}>
                {MONTHS[tempMonth - 1]}
              </Text>
              <TouchableOpacity
                style={dpStyles.btn}
                onPress={() => setTempMonth((m) => (m >= 12 ? 1 : m + 1))}
              >
                <Text style={dpStyles.btnText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ano */}
          <View style={dpStyles.row}>
            <Text style={dpStyles.label}>Ano</Text>
            <View style={dpStyles.controls}>
              <TouchableOpacity
                style={dpStyles.btn}
                onPress={() =>
                  setTempYear((y) => {
                    const i = years.indexOf(y);
                    return i < years.length - 1 ? years[i + 1] : y;
                  })
                }
              >
                <Text style={dpStyles.btnText}>‹</Text>
              </TouchableOpacity>
              <Text style={dpStyles.value}>{tempYear}</Text>
              <TouchableOpacity
                style={dpStyles.btn}
                onPress={() =>
                  setTempYear((y) => {
                    const i = years.indexOf(y);
                    return i > 0 ? years[i - 1] : y;
                  })
                }
              >
                <Text style={dpStyles.btnText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preview */}
          <View style={dpStyles.preview}>
            <Text style={dpStyles.previewText}>
              {formatDateDisplay(tempDay, tempMonth, tempYear)}
            </Text>
          </View>

          <View style={dpStyles.buttons}>
            <TouchableOpacity style={dpStyles.cancelBtn} onPress={onCancel}>
              <Text style={dpStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dpStyles.confirmBtn}
              onPress={handleConfirm}
            >
              <Text style={dpStyles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation, expenses }) {
  const today = new Date();

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // ─── Estado do filtro de data ─────────────────────────────────
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [filterFrom, setFilterFrom] = useState(firstDay); // início do mês atual
  const [filterTo, setFilterTo] = useState(today); // hoje

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [filterActive, setFilterActive] = useState(false); // false = sem filtro

  // ─── Gastos filtrados ─────────────────────────────────────────
  const filteredExpenses = useMemo(() => {
    if (!filterActive) return expenses;

    const from = toMidnight(filterFrom);
    const to = toMidnight(filterTo);
    to.setHours(23, 59, 59, 999);

    return expenses.filter((e) => {
      if (!e.date) return true; // gastos sem data passam sempre
      const d = new Date(e.date);
      return d >= from && d <= to;
    });
  }, [expenses, filterActive, filterFrom, filterTo]);

  const total = filteredExpenses.reduce((sum, item) => sum + item.value, 0);

  // ─── Totais por categoria ─────────────────────────────────────
  const categoryTotals = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catExpenses = filteredExpenses.filter(
        (e) => e.category?.id === cat.id,
      );
      const catTotal = catExpenses.reduce((sum, e) => sum + e.value, 0);
      const percentage = total > 0 ? (catTotal / total) * 100 : 0;
      return { ...cat, total: catTotal, count: catExpenses.length, percentage };
    })
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses, total]);

  const maxCatValue = categoryTotals.length > 0 ? categoryTotals[0].total : 1;

  const topExpense =
    filteredExpenses.length > 0
      ? filteredExpenses.reduce(
          (max, e) => (e.value > max.value ? e : max),
          filteredExpenses[0],
        )
      : null;

  // ─── Helpers ──────────────────────────────────────────────────
  const dateLabel = (d) =>
    formatDateDisplay(d.getDate(), d.getMonth() + 1, d.getFullYear());

  const EmptyDashboard = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📊</Text>
      <Text style={styles.emptyTitle}>
        {filterActive ? "Sem gastos nesse período" : "Sem dados ainda"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {filterActive
          ? "Tente ampliar o intervalo de datas"
          : "Adicione gastos com categorias para visualizar o dashboard"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* ─── Cabeçalho ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Visão geral dos seus gastos</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Painel de Filtro de Data ──────────────────────────── */}
        <View style={styles.filterCard}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>🗓️ Filtro por Período</Text>
            <TouchableOpacity
              style={[
                styles.filterToggle,
                filterActive && styles.filterToggleActive,
              ]}
              onPress={() => setFilterActive((v) => !v)}
            >
              <Text
                style={[
                  styles.filterToggleText,
                  filterActive && styles.filterToggleTextActive,
                ]}
              >
                {filterActive ? "✓ Ativo" : "Ativar"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            {/* De */}
            <View style={styles.filterDateBlock}>
              <Text style={styles.filterDateLabel}>DE</Text>
              <TouchableOpacity
                style={[
                  styles.filterDateBtn,
                  !filterActive && styles.filterDateBtnDisabled,
                ]}
                onPress={() => filterActive && setShowFromPicker(true)}
                activeOpacity={filterActive ? 0.8 : 1}
              >
                <Text
                  style={[
                    styles.filterDateText,
                    !filterActive && styles.filterDateTextDisabled,
                  ]}
                >
                  {dateLabel(filterFrom)}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterArrow}>→</Text>

            {/* Até */}
            <View style={styles.filterDateBlock}>
              <Text style={styles.filterDateLabel}>ATÉ</Text>
              <TouchableOpacity
                style={[
                  styles.filterDateBtn,
                  !filterActive && styles.filterDateBtnDisabled,
                ]}
                onPress={() => filterActive && setShowToPicker(true)}
                activeOpacity={filterActive ? 0.8 : 1}
              >
                <Text
                  style={[
                    styles.filterDateText,
                    !filterActive && styles.filterDateTextDisabled,
                  ]}
                >
                  {dateLabel(filterTo)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {filterActive && (
            <Text style={styles.filterHint}>
              {filteredExpenses.length}{" "}
              {filteredExpenses.length === 1
                ? "gasto encontrado"
                : "gastos encontrados"}{" "}
              nesse período
            </Text>
          )}
        </View>

        {/* ─── Conteúdo do dashboard ─────────────────────────────── */}
        {filteredExpenses.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <>
            {/* Cards Resumo */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryEmoji}>💰</Text>
                <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
                <Text style={styles.summaryLabel}>Total gasto</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryEmoji}>🧾</Text>
                <Text style={styles.summaryValue}>
                  {filteredExpenses.length}
                </Text>
                <Text style={styles.summaryLabel}>Registros</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryEmoji}>🗂️</Text>
                <Text style={styles.summaryValue}>{categoryTotals.length}</Text>
                <Text style={styles.summaryLabel}>Categorias</Text>
              </View>
            </View>

            {/* Gráfico de Barras */}
            {categoryTotals.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gastos por Categoria</Text>
                <View style={styles.chartContainer}>
                  {categoryTotals.map((cat) => {
                    const barWidth =
                      (cat.total / maxCatValue) * (SCREEN_WIDTH - 100);
                    return (
                      <View key={cat.id} style={styles.barRow}>
                        <View style={styles.barLabelContainer}>
                          <Text style={styles.barEmoji}>{cat.emoji}</Text>
                          <Text style={styles.barLabel} numberOfLines={1}>
                            {cat.label}
                          </Text>
                        </View>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.barFill,
                              { width: barWidth, backgroundColor: cat.color },
                            ]}
                          />
                          <Text style={styles.barValue}>
                            {formatCurrency(cat.total)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Detalhes por Categoria */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalhes por Categoria</Text>
              {categoryTotals.map((cat) => (
                <View key={cat.id} style={styles.categoryCard}>
                  <View
                    style={[
                      styles.categoryCardIcon,
                      { backgroundColor: cat.color + "33" },
                    ]}
                  >
                    <Text style={styles.categoryCardEmoji}>{cat.emoji}</Text>
                  </View>
                  <View style={styles.categoryCardInfo}>
                    <Text style={styles.categoryCardName}>{cat.label}</Text>
                    <Text style={styles.categoryCardCount}>
                      {cat.count} {cat.count === 1 ? "gasto" : "gastos"}
                    </Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.categoryCardRight}>
                    <Text style={styles.categoryCardValue}>
                      {formatCurrency(cat.total)}
                    </Text>
                    <Text style={styles.categoryCardPercent}>
                      {cat.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Maior Gasto */}
            {topExpense && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Maior Gasto</Text>
                <View style={styles.topExpenseCard}>
                  <View style={styles.topExpenseLeft}>
                    <Text style={styles.topExpenseEmoji}>
                      {topExpense.category ? topExpense.category.emoji : "💸"}
                    </Text>
                    <View>
                      <Text style={styles.topExpenseDesc}>
                        {topExpense.description}
                      </Text>
                      {topExpense.category && (
                        <Text style={styles.topExpenseCat}>
                          {topExpense.category.label}
                        </Text>
                      )}
                      {topExpense.date && (
                        <Text style={styles.topExpenseDate}>
                          📅 {dateLabel(new Date(topExpense.date))}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.topExpenseValue}>
                    {formatCurrency(topExpense.value)}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* ─── Modais de data ───────────────────────────────────────── */}
      <DatePickerModal
        visible={showFromPicker}
        title="📅 Data Inicial"
        initialDay={filterFrom.getDate()}
        initialMonth={filterFrom.getMonth() + 1}
        initialYear={filterFrom.getFullYear()}
        onConfirm={(d, m, y) => {
          setFilterFrom(new Date(y, m - 1, d, 12));
          setShowFromPicker(false);
        }}
        onCancel={() => setShowFromPicker(false)}
      />

      <DatePickerModal
        visible={showToPicker}
        title="📅 Data Final"
        initialDay={filterTo.getDate()}
        initialMonth={filterTo.getMonth() + 1}
        initialYear={filterTo.getFullYear()}
        onConfirm={(d, m, y) => {
          setFilterTo(new Date(y, m - 1, d, 12));
          setShowToPicker(false);
        }}
        onCancel={() => setShowToPicker(false)}
      />
    </SafeAreaView>
  );
}

// ─── Estilos do DatePickerModal ───────────────────────────────────────────────
const dpStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: { fontSize: 14, fontWeight: "700", color: "#1a1a2e", width: 50 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  btn: {
    backgroundColor: "#f0f0f7",
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 22,
    color: "#e94560",
    fontWeight: "700",
    lineHeight: 26,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
    marginHorizontal: 16,
    minWidth: 36,
    textAlign: "center",
  },
  valueWide: { minWidth: 100 },
  preview: {
    backgroundColor: "#f0f0f7",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  previewText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#e94560",
    letterSpacing: 1,
  },
  buttons: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0ee",
  },
  cancelText: { color: "#8888aa", fontSize: 15, fontWeight: "600" },
  confirmBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#e94560",
  },
  confirmText: { color: "#ffffff", fontSize: 15, fontWeight: "800" },
});

// ─── Estilos da tela ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1a1a2e" },

  header: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  backButton: { marginBottom: 16, alignSelf: "flex-start" },
  backButtonText: { color: "#e94560", fontSize: 15, fontWeight: "700" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  headerSubtitle: { fontSize: 13, color: "#8888aa", marginTop: 4 },

  scrollArea: {
    flex: 1,
    backgroundColor: "#f0f0f7",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },

  // ─── Filtro ───────────────────────────────────────────────────
  filterCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  filterTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a2e" },
  filterToggle: {
    backgroundColor: "#f0f0f7",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#e0e0ee",
  },
  filterToggleActive: {
    backgroundColor: "#e94560",
    borderColor: "#e94560",
  },
  filterToggleText: { fontSize: 13, fontWeight: "700", color: "#9999bb" },
  filterToggleTextActive: { color: "#ffffff" },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterDateBlock: { flex: 1 },
  filterDateLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#9999bb",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  filterDateBtn: {
    backgroundColor: "#f0f0f7",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#e0e0ee",
    alignItems: "center",
  },
  filterDateBtnDisabled: {
    opacity: 0.4,
  },
  filterDateText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  filterDateTextDisabled: {
    color: "#9999bb",
  },
  filterArrow: {
    fontSize: 18,
    color: "#9999bb",
    fontWeight: "700",
    marginTop: 18,
  },
  filterHint: {
    fontSize: 11,
    color: "#e94560",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },

  // ─── Seções ───────────────────────────────────────────────────
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  // ─── Resumo ───────────────────────────────────────────────────
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryEmoji: { fontSize: 22, marginBottom: 6 },
  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: 10,
    color: "#9999bb",
    marginTop: 2,
    textAlign: "center",
  },

  // ─── Gráfico ──────────────────────────────────────────────────
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  barRow: { marginBottom: 14 },
  barLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  barEmoji: { fontSize: 14, marginRight: 6 },
  barLabel: { fontSize: 12, fontWeight: "600", color: "#555577" },
  barTrack: { flexDirection: "row", alignItems: "center", gap: 8 },
  barFill: { height: 12, borderRadius: 6, minWidth: 8 },
  barValue: { fontSize: 12, fontWeight: "700", color: "#1a1a2e" },

  // ─── Cards de categoria ───────────────────────────────────────
  categoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryCardEmoji: { fontSize: 20 },
  categoryCardInfo: { flex: 1 },
  categoryCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 2,
  },
  categoryCardCount: { fontSize: 11, color: "#9999bb", marginBottom: 6 },
  progressTrack: {
    height: 4,
    backgroundColor: "#e0e0ee",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: 4, borderRadius: 2 },
  categoryCardRight: { alignItems: "flex-end", marginLeft: 12 },
  categoryCardValue: { fontSize: 14, fontWeight: "800", color: "#1a1a2e" },
  categoryCardPercent: { fontSize: 11, color: "#9999bb", marginTop: 2 },

  // ─── Maior gasto ──────────────────────────────────────────────
  topExpenseCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topExpenseLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  topExpenseEmoji: { fontSize: 28, marginRight: 12 },
  topExpenseDesc: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
  topExpenseCat: { fontSize: 11, color: "#8888aa", marginTop: 2 },
  topExpenseDate: { fontSize: 11, color: "#555577", marginTop: 3 },
  topExpenseValue: { fontSize: 16, fontWeight: "900", color: "#e94560" },

  // ─── Vazio ────────────────────────────────────────────────────
  emptyContainer: { alignItems: "center", paddingTop: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
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
});
