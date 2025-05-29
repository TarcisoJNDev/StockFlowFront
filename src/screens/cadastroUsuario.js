import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import api from '../services/api';

export default function CadastroUsuario({ visible, onClose, navigation }) {
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [permissao, setPermissao] = useState('Administrador');
  const [menuVisible, setMenuVisible] = useState(false);

  const salvarUsuario = async () => {
    try {
      const novoUsuario = {
        nome: nome,
        email: "teste@gmail.com",
        senha: "12345",
        tipo: "administrador"
      };
      const response = await api.post('/usuario/', novoUsuario);
      console.log('Usuário cadastrado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  const handleAdd = () => {
    salvarUsuario();
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

            <Text style={styles.title}>Usuários</Text>

            <TextInput
              label="Nome*"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              textColor="#000"
              style={styles.input}
              right={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Celular*"
              value={celular}
              onChangeText={setCelular}
              keyboardType="phone-pad"
              mode="outlined"
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              textColor="#000"
              style={styles.input}
              right={<TextInput.Icon icon="phone" />}
            />

            <Text style={styles.info}>
              - Administrador(a): Acesso a todas as funcionalidades.{"\n"}
              - Vendedor(a): Acesso a vendas, estoque, pedidos, fiados (apenas pedidos) e clientes.
            </Text>

            <View>
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                <TextInput
                  label="Permissão*"
                  value={permissao}
                  mode="outlined"
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  textColor="#000"
                  style={styles.input}
                  editable={false}
                  right={<TextInput.Icon icon="menu-down" />}
                />
              </TouchableOpacity>

              {menuVisible && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPermissao('Administrador');
                      setMenuVisible(false);
                    }}
                  >
                    <Text>Administrador</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPermissao('Vendedor');
                      setMenuVisible(false);
                    }}
                  >
                    <Text>Vendedor</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
    textAlign: 'left',
  },
  input: {
    marginBottom: 12,
  },
  info: {
    fontSize: 12,
    color: '#444',
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    padding: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: -8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});