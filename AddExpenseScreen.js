// screens/AddExpenseScreen.js — Tela 2: Formulário de Novo Gasto
// Permite ao usuário inserir descrição, categoria, valor e data

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";

// ─── Categorias disponíveis ───────────────────────────────────────────────────
export const CATEGORIES = [
  { id: "alimentacao", label: "Alimentação", emoji: "🍔", color: "#FF6B6B" },
  { id: "transporte", label: "Transporte", emoji: "🚗", color: "#4ECDC4" },
  { id: "lazer", label: "Lazer", emoji: "🎮", color: "#45B7D1" },
  { id: "saude", label: "Saúde", emoji: "❤️", color: "#96CEB4" },
  { id: "educacao", label: "Educação", emoji: "📚", color: "#FFEAA7" },
  { id: "outros", label: "Outros", emoji: "📦", color: "#DDA0DD" },
];

// ─── Helpers de data ──────────────────────────────────────────────────────────
const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const formatDateDisplay = (day, month, year) => {
  const d = String(day).padStart(2, "0");
  const m = String(month).padStart(2, "0");
  return `${d}/${m}/${year}`;
};

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

export default function AddExpenseScreen({ navigation, addExpense }) {
  const today = new Date();

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [descFocused, setDescFocused] = useState(false);
  const [valueFocused, setValueFocused] = useState(false);

  // ─── Estado de data ───────────────────────────────────────────
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1–12
  const [year, setYear] = useState(today.getFullYear());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Seletores temporários dentro do modal
  const [tempDay, setTempDay] = useState(day);
  const [tempMonth, setTempMonth] = useState(month);
  const [tempYear, setTempYear] = useState(year);

  const currentYear = today.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // últimos 5 anos

  const openDatePicker = () => {
    setTempDay(day);
    setTempMonth(month);
    setTempYear(year);
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    const maxDay = getDaysInMonth(tempMonth, tempYear);
    const safeDay = Math.min(tempDay, maxDay);
    setDay(safeDay);
    setMonth(tempMonth);
    setYear(tempYear);
    setShowDatePicker(false);
  };

  // ─── Validação e salvamento ──────────────────────────────────
  const handleSave = () => {
    const trimmedDescription = description.trim();

    if (!trimmedDescription) {
      setErrorMessage("Preencha todos os campos corretamente.");
      return;
    }
    if (!selectedCategory) {
      setErrorMessage("Selecione uma categoria.");
      return;
    }
    if (!value.trim()) {
      setErrorMessage("Preencha todos os campos corretamente.");
      return;
    }

    const normalizedValue = value.replace(",", ".");
    const parsedValue = parseFloat(normalizedValue);

    if (isNaN(parsedValue) || parsedValue <= 0) {
      setErrorMessage("Digite um valor válido maior que zero.");
      return;
    }

    setErrorMessage(null);

    // Monta objeto de data (usamos noon para evitar problemas de fuso)
    const expenseDate = new Date(year, month - 1, day, 12, 0, 0);

    addExpense({
      description: trimmedDescription,
      value: parsedValue,
      category: selectedCategory,
      date: expenseDate.toISOString(),
    });
    navigation.goBack();
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    if (errorMessage) setErrorMessage(null);
  };

  const handleValueChange = (text) => {
    setValue(text);
    if (errorMessage) setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Cabeçalho ──────────────────────────────────────── */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Novo Gasto</Text>
            <Text style={styles.headerSubtitle}>
              Registre um novo item na sua caderneta
            </Text>
          </View>

          {/* ─── Formulário ─────────────────────────────────────── */}
          <View style={styles.formCard}>
            {/* Campo 1: Descrição */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Descrição do gasto</Text>
              <TextInput
                style={[
                  styles.input,
                  descFocused && styles.inputFocused,
                  errorMessage && !description.trim() && styles.inputError,
                ]}
                placeholder="Ex: Mercado, Uber, Academia..."
                placeholderTextColor="#aaaacc"
                value={description}
                onChangeText={handleDescriptionChange}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                returnKeyType="next"
                maxLength={60}
              />
              <Text style={styles.fieldHint}>
                {description.length}/60 caracteres
              </Text>
            </View>

            {/* Campo 2: Categoria */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Categoria</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        isSelected && {
                          backgroundColor: cat.color,
                          borderColor: cat.color,
                        },
                      ]}
                      onPress={() => {
                        setSelectedCategory(cat);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                      <Text
                        style={[
                          styles.categoryLabel,
                          isSelected && styles.categoryLabelSelected,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Campo 3: Valor */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Valor (R$)</Text>
              <View
                style={[
                  styles.inputWrapper,
                  valueFocused && styles.inputWrapperFocused,
                  errorMessage && !value.trim() && styles.inputWrapperError,
                ]}
              >
                <Text style={styles.currencyPrefix}>R$</Text>
                <TextInput
                  style={styles.inputCurrency}
                  placeholder="0,00"
                  placeholderTextColor="#aaaacc"
                  value={value}
                  onChangeText={handleValueChange}
                  onFocus={() => setValueFocused(true)}
                  onBlur={() => setValueFocused(false)}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
              </View>
              <Text style={styles.fieldHint}>
                Use vírgula ou ponto como separador decimal
              </Text>
            </View>

            {/* Campo 4: Data */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Data da compra</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={openDatePicker}
                activeOpacity={0.8}
              >
                <Text style={styles.dateButtonEmoji}>📅</Text>
                <Text style={styles.dateButtonText}>
                  {formatDateDisplay(day, month, year)}
                </Text>
                <Text style={styles.dateButtonArrow}>▼</Text>
              </TouchableOpacity>
              {day === today.getDate() &&
                month === today.getMonth() + 1 &&
                year === today.getFullYear() && (
                  <Text style={styles.fieldHint}>
                    📍 Data atual selecionada
                  </Text>
                )}
            </View>

            {/* ─── Mensagem de erro inline ──────────────────────── */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* ─── Botão Salvar ─────────────────────────────────── */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>💾 Salvar Gasto</Text>
            </TouchableOpacity>

            {/* ─── Botão Cancelar ───────────────────────────────── */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>
              💡 Todos os gastos ficam salvos enquanto o app estiver aberto.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ─── Modal Seletor de Data ────────────────────────────────── */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📅 Selecionar Data</Text>

            {/* Linha: Dia */}
            <View style={styles.pickerRow}>
              <Text style={styles.pickerLabel}>Dia</Text>
              <View style={styles.pickerControls}>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setTempDay((d) => Math.max(1, d - 1))}
                >
                  <Text style={styles.pickerBtnText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>
                  {String(tempDay).padStart(2, "0")}
                </Text>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() =>
                    setTempDay((d) =>
                      Math.min(getDaysInMonth(tempMonth, tempYear), d + 1),
                    )
                  }
                >
                  <Text style={styles.pickerBtnText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Linha: Mês */}
            <View style={styles.pickerRow}>
              <Text style={styles.pickerLabel}>Mês</Text>
              <View style={styles.pickerControls}>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setTempMonth((m) => (m <= 1 ? 12 : m - 1))}
                >
                  <Text style={styles.pickerBtnText}>‹</Text>
                </TouchableOpacity>
                <Text style={[styles.pickerValue, styles.pickerValueWide]}>
                  {MONTHS[tempMonth - 1]}
                </Text>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setTempMonth((m) => (m >= 12 ? 1 : m + 1))}
                >
                  <Text style={styles.pickerBtnText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Linha: Ano */}
            <View style={styles.pickerRow}>
              <Text style={styles.pickerLabel}>Ano</Text>
              <View style={styles.pickerControls}>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() =>
                    setTempYear((y) => {
                      const idx = years.indexOf(y);
                      return idx < years.length - 1 ? years[idx + 1] : y;
                    })
                  }
                >
                  <Text style={styles.pickerBtnText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{tempYear}</Text>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() =>
                    setTempYear((y) => {
                      const idx = years.indexOf(y);
                      return idx > 0 ? years[idx - 1] : y;
                    })
                  }
                >
                  <Text style={styles.pickerBtnText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preview da data selecionada */}
            <View style={styles.datePreview}>
              <Text style={styles.datePreviewText}>
                {formatDateDisplay(tempDay, tempMonth, tempYear)}
              </Text>
            </View>

            {/* Botões do modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={confirmDate}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // ─── Cabeçalho ───────────────────────────────────────────────
  header: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#e94560",
    fontSize: 15,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8888aa",
    marginTop: 4,
  },

  // ─── Card do formulário ───────────────────────────────────────
  formCard: {
    backgroundColor: "#f0f0f7",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    flex: 1,
  },

  // ─── Grupos de campos ─────────────────────────────────────────
  fieldGroup: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a2e",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 11,
    color: "#9999bb",
    marginTop: 5,
  },

  // ─── Inputs ───────────────────────────────────────────────────
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a1a2e",
    borderWidth: 2,
    borderColor: "#e0e0ee",
  },
  inputFocused: {
    borderColor: "#e94560",
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  inputError: {
    borderColor: "#ff4d6d",
    backgroundColor: "#fff5f7",
  },
  inputWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e0e0ee",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: "#e94560",
  },
  inputWrapperError: {
    borderColor: "#ff4d6d",
    backgroundColor: "#fff5f7",
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e94560",
    marginRight: 8,
  },
  inputCurrency: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#1a1a2e",
  },

  // ─── Categorias ───────────────────────────────────────────────
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#e0e0ee",
    marginBottom: 4,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555577",
  },
  categoryLabelSelected: {
    color: "#1a1a2e",
    fontWeight: "800",
  },

  // ─── Data ─────────────────────────────────────────────────────
  dateButton: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e0e0ee",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  dateButtonEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    letterSpacing: 0.5,
  },
  dateButtonArrow: {
    fontSize: 12,
    color: "#9999bb",
  },

  // ─── Mensagem de erro ─────────────────────────────────────────
  errorContainer: {
    backgroundColor: "#fff0f3",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffd6dd",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  errorText: {
    color: "#cc2244",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },

  // ─── Botões ───────────────────────────────────────────────────
  saveButton: {
    backgroundColor: "#e94560",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#e94560",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 7,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  cancelButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddddee",
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    color: "#8888aa",
    fontSize: 15,
    fontWeight: "600",
  },

  // ─── Dica informativa ─────────────────────────────────────────
  tipContainer: {
    backgroundColor: "#1a1a2e",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  tipText: {
    color: "#555577",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },

  // ─── Modal de data ────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 24,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
    width: 50,
  },
  pickerControls: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  pickerBtn: {
    backgroundColor: "#f0f0f7",
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerBtnText: {
    fontSize: 22,
    color: "#e94560",
    fontWeight: "700",
    lineHeight: 26,
  },
  pickerValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
    marginHorizontal: 16,
    minWidth: 36,
    textAlign: "center",
  },
  pickerValueWide: {
    minWidth: 100,
  },
  datePreview: {
    backgroundColor: "#f0f0f7",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  datePreviewText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#e94560",
    letterSpacing: 1,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0ee",
  },
  modalCancelText: {
    color: "#8888aa",
    fontSize: 15,
    fontWeight: "600",
  },
  modalConfirmBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#e94560",
  },
  modalConfirmText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
