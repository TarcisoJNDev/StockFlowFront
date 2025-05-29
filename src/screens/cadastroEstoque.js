import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';

export default function CadastroEstoque({ visible, onClose, navigation }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack('')} >
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Controle</Text>

          <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('EntradaEstoque')}>
            <Text style={styles.optionTitle}>Entrada de Estoque</Text>
            <Text style={styles.optionText}>
              Utilize essa opção para cadastrar uma nova entrada de estoque de produto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('RetiradaEstoque')}>
            <Text style={styles.optionTitle}>Debitar</Text>
            <Text style={styles.optionText}>
              Quebrou, cadastrou errado, venceu? Utilize essa opção para debitar do estoque sem refletir no financeiro
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.11)',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'android' ? 60 : 30,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: '100%',
    minHeight: '30%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionCard: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    elevation: 2,
  },
  optionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  optionText: {
    fontSize: 14,
    color: '#555',
  },
});