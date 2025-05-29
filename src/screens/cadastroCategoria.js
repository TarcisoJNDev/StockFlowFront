import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

export default function CadastroCategoria({ visible, onClose, navigation }) {
  const [titulo, setTitulo] = useState('');

  const handleAdd = () => {
    const novaCategoria = { titulo };
    console.log('Nova categoria:', novaCategoria);
    if (typeof onAdicionar === 'function') {
      onAdicionar(novaCategoria);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
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
        <View style={styles.overlay}>
          <View style={styles.container}>
            <IconButton
              icon={() => <Icon name="close" size={24} />}
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            />

            <Text style={styles.title}>Categorias de Produtos</Text>

            <TextInput
              label="Título*"
              value={titulo}
              onChangeText={setTitulo}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              textColor="#000"
            />

            <Button
              mode="contained"
              onPress={handleAdd}
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
            >
              Adicionar
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    position: 'relative',
    marginBottom: 0,
    paddingBottom: Platform.OS === 'android' ? 10 : 20,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
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
    marginBottom: 40,
    padding: 8,
  },
});