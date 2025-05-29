import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EntradaEstoque({ visible, onClose, navigation }) {
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleAdd = () => {
    const formData = { produto, quantidade, observacao };
    console.log('Dados do formulário:', formData);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.container}>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => navigation.goBack()}
                  style={styles.closeButton}
                />

                <Text style={styles.title}>Entrada de Estoque</Text>

                <TextInput
                  label="Produto*"
                  value={produto}
                  onChangeText={setProduto}
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  textColor="#000"
                  right={<TextInput.Icon icon={() => <Icon name="package-variant-closed" size={20} />} />}
                />

                <TextInput
                  label="Quantidade*"
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  textColor="#000"
                  right={<TextInput.Icon icon={() => <Icon name="numeric" size={20} />} />}
                />

                <TextInput
                  label="Observação"
                  value={observacao}
                  onChangeText={setObservacao}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={[styles.input, { height: 100 }]}
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  textColor="#000"
                  right={<TextInput.Icon icon={() => <Icon name="note-text-outline" size={20} />} />}
                />

                <Button
                  mode="contained"
                  onPress={handleAdd}
                  style={[styles.button, { backgroundColor: '#4CAF50' }]}
                >
                  Adicionar
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    padding: 8,
    borderRadius: 8,
  },
});