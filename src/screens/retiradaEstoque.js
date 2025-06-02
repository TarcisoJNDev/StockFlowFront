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
  Dimensions,
  Alert
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function RetiradaEstoque({ visible, onClose, navigation, onDebitar }) {
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  const debitarEstoque = async () => {
    try {
      setLoading(true);

      // Validações básicas
      if (!produto) {
        Alert.alert('Atenção', 'Por favor, selecione um produto');
        return;
      }

      if (!quantidade || isNaN(quantidade)) {
        Alert.alert('Atenção', 'Por favor, informe uma quantidade válida');
        return;
      }

      // Preparar dados para envio
      const dadosRetirada = {
        produto_id: produto.id, // Assumindo que produto é um objeto com id
        quantidade: Number(quantidade),
        observacao: observacao || null
      };

      console.log("📤 Dados da retirada:", dadosRetirada);
      
      // Simulação de requisição (substitua pelo seu endpoint real)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Versão real (descomente quando tiver o endpoint)
      // const response = await api.post('/estoque/retiradas', dadosRetirada);
      // console.log('Retirada registrada:', response.data);

      Alert.alert('Sucesso', 'Retirada de estoque registrada com sucesso!');
      
      // Limpar formulário após sucesso
      setProduto('');
      setQuantidade('');
      setObservacao('');
      
      // Fechar modal se necessário
      if (onClose) onClose();

      // Chamar callback se existir
      if (typeof onDebitar === 'function') {
        onDebitar(dadosRetirada);
      }

    } catch (error) {
      console.error('Erro ao registrar retirada:', error);
      Alert.alert(
        'Erro', 
        error.response?.data?.message || 'Falha ao registrar retirada de estoque'
      );
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
                  icon="close"
                  size={width * 0.06}
                  onPress={() => navigation.goBack()}
                  style={styles.closeButton}
                />

                <Text style={styles.title}>Debitar Estoque</Text>

                <TextInput
                  label="Produto*"
                  value={produto.nome || produto} // Adapte conforme sua estrutura de dados
                  onChangeText={setProduto}
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor="#f44336"
                  outlineColor="#ccc"
                  textColor="#000"
                  right={<TextInput.Icon icon={() => <Icon name="package-variant" size={width * 0.05} />} />}
                />

                <TextInput
                  label="Quantidade*"
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor="#f44336"
                  outlineColor="#ccc"
                  textColor="#000"
                  right={<TextInput.Icon icon={() => <Icon name="numeric" size={width * 0.05} />} />}
                />

                <TextInput
                  label="Observação"
                  value={observacao}
                  onChangeText={setObservacao}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={[styles.input, { height: height * 0.12 }]}
                  activeOutlineColor="#f44336"
                  outlineColor="#ccc"
                  textColor="#000"
                  right={<TextInput.Icon icon={() => <Icon name="note-outline" size={width * 0.05} />} />}
                />

                <Button
                  mode="contained"
                  onPress={debitarEstoque}
                  style={[styles.button, { backgroundColor: '#f44336' }]}
                  loading={loading}
                  disabled={loading}
                  labelStyle={{ fontSize: width * 0.04 }}
                >
                  {loading ? 'Processando...' : 'Debitar'}
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
    padding: width * 0.05,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: width * 0.03,
    top: width * 0.03,
    zIndex: 1,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    marginBottom: height * 0.015,
  },
  button: {
    marginTop: height * 0.025,
    padding: width * 0.02,
    borderRadius: width * 0.02,
  },
});