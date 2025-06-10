import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

export default function CadastroUsuario({ visible, onClose, navigation, onUsuarioAdicionado }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [senha, setSenha] = useState('');
  const [permissao, setPermissao] = useState('Administrador');
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const salvarUsuario = async () => {
    try {
      setLoading(true);

      // Validações básicas
      if (!nome) {
        Alert.alert('Atenção', 'Por favor, informe o nome do usuário');
        return;
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        Alert.alert('Atenção', 'Por favor, informe um e-mail válido');
        return;
      }

      if (!celular || celular.replace(/\D/g, '').length < 11) {
        Alert.alert('Atenção', 'Por favor, informe um celular válido (com DDD)');
        return;
      }

      if (!senha || senha.length < 6) {
        Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres');
        return;
      }

      // Mapeia a permissão selecionada para o enum do backend
      const permissaoBackend = permissao === 'Administrador' ? 'Administrador' : 'Vendedor';

      // Monta o objeto conforme a entidade Usuario no backend
      const novoUsuario = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        celular: celular.replace(/\D/g, ''),
        senha: senha, // O backend deve fazer o hash dessa senha
        permissao: permissaoBackend
      };

      // Chamada real para a API
      const response = await api.post('/usuario/', novoUsuario);
      
      // Limpa o formulário após sucesso
      setNome('');
      setEmail('');
      setCelular('');
      setSenha('');
      setPermissao('Administrador');
      
      // Fecha o modal se necessário
      if (onClose) onClose();

      // Chama callback se existir
      if (typeof onUsuarioAdicionado === 'function') {
        onUsuarioAdicionado(response.data);
      }

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      
      // Tratamento de erros específicos
      let errorMessage = 'Falha ao cadastrar usuário';
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'E-mail já cadastrado';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
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
                  icon={() => <Icon name="close" size={width * 0.06} />}
                  onPress={() => navigation.goBack()}
                  style={styles.closeButton}
                />

                <Text style={styles.title}>Cadastro de Usuário</Text>

                <TextInput
                  label="Nome Completo*"
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
                  label="E-mail*"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="outlined"
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  textColor="#000"
                  style={styles.input}
                  right={<TextInput.Icon icon="email" />}
                />

                <TextInput
                  label="Celular* (com DDD)"
                  value={celular}
                  onChangeText={(text) => {
                    // Formatação básica do celular
                    const formattedText = text
                      .replace(/\D/g, '')
                      .replace(/(\d{2})(\d)/, '($1) $2')
                      .replace(/(\d{5})(\d)/, '$1-$2')
                      .replace(/(-\d{4})\d+?$/, '$1');
                    setCelular(formattedText);
                  }}
                  keyboardType="phone-pad"
                  mode="outlined"
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  textColor="#000"
                  style={styles.input}
                  right={<TextInput.Icon icon="phone" />}
                  maxLength={15}
                />

                <TextInput
                  label="Senha* (mínimo 6 caracteres)"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  mode="outlined"
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  textColor="#000"
                  style={styles.input}
                  right={<TextInput.Icon icon="lock" />}
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
                      right={<TextInput.Icon icon={menuVisible ? "menu-up" : "menu-down"} />}
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
                  onPress={salvarUsuario}
                  style={[styles.button, { backgroundColor: '#4CAF50' }]}
                  loading={loading}
                  disabled={loading}
                  labelStyle={{ fontSize: width * 0.04 }}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? height * 0.02 : 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    padding: width * 0.05,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: width * 0.03,
    top: width * 0.03,
    zIndex: 1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: '#000',
    textAlign: 'left',
  },
  input: {
    marginBottom: height * 0.015,
  },
  info: {
    fontSize: width * 0.03,
    color: '#444',
    marginBottom: height * 0.015,
    lineHeight: height * 0.025,
  },
  button: {
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    padding: height * 0.015,
    borderRadius: width * 0.02,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    marginTop: -height * 0.01,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
  },
  dropdownItem: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});