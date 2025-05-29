import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function FiltroEstoque({ visible, onClose, onPesquisar, onLimpar, navigation }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack('')} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Baixo estoque</Text>
          <TextInput style={styles.input} placeholder="Selecione" />

          <Text style={styles.label}>Fornecedores</Text>
          <TextInput style={styles.input} placeholder="Selecione" />

          <Text style={styles.label}>Categorias</Text>
          <TextInput style={styles.input} placeholder="Selecione" />

          <Text style={styles.label}>Visível no catálogo</Text>
          <TextInput style={styles.input} placeholder="Selecione" />

          <TouchableOpacity style={styles.limparButton} onPress={onLimpar}>
            <Text style={styles.limparText}>Limpar Filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pesquisarButton} onPress={onPesquisar}>
            <Text style={styles.pesquisarText}>Pesquisar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  limparButton: {
    marginTop: 20,
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  limparText: {
    color: '#c82333',
    fontWeight: 'bold',
  },
  pesquisarButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  pesquisarText: {
    color: 'white',
    fontWeight: 'bold',
  },
});