import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Text,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';

export default function CadastroFornecedor({ navigation }) {
  
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatCPF = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleaned.length > 0) formattedText = (`${cleaned.substring(0, 3)}`);
    if (cleaned.length > 3) formattedText = (`${formattedText}.${cleaned.substring(3, 6)}`);
    if (cleaned.length > 6) formattedText = (`${formattedText}.${cleaned.substring(6, 9)}`);
    if (cleaned.length > 9) formattedText = (`${formattedText}-${cleaned.substring(9, 11)}`);

    return formattedText;
  };

  const formatCNPJ = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleaned.length > 0) formattedText = (`${cleaned.substring(0, 2)}`);
    if (cleaned.length > 2) formattedText = (`${formattedText}.${cleaned.substring(2, 5)}`);
    if (cleaned.length > 5) formattedText = (`${formattedText}.${cleaned.substring(5, 8)}`);
    if (cleaned.length > 8) formattedText = (`${formattedText}/${cleaned.substring(8, 12)}`);
    if (cleaned.length > 12) formattedText = (`${formattedText}-${cleaned.substring(12, 14)}`);

    return formattedText;
  };

  const handleCpfCnpjChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setCpfCnpj(formatCPF(text));
    } else {
      setCpfCnpj(formatCNPJ(text));
    }
  };

  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleaned.length > 0) formattedText = (`(${cleaned.substring(0, 2)})`);
    if (cleaned.length > 2) formattedText = (`${formattedText} ${cleaned.substring(2, 7)}`);
    if (cleaned.length > 7) formattedText = (`${formattedText}-${cleaned.substring(7, 11)}`);

    return formattedText;
  };

  const cadastrarFornecedor = async () => {
    try {
      setLoading(true);

      if (!nome) {
        Alert.alert('Atenção', 'Por favor, informe o nome do fornecedor');
        return;
      }

      if (!cpfCnpj) {
        Alert.alert('Atenção', 'Por favor, informe o CPF/CNPJ');
        return;
      }

      const dadosFornecedor = {
        nome,
        cpf_cnpj: cpfCnpj.replace(/\D/g, ''), // Remove formatação
        telefone: telefone.replace(/\D/g, ''), // Remove formatação
        email: email || "", // Garante string vazia se não informado
        observacao: observacao || "" // Garante string vazia se não informado
      };

      // Chamada real para a API
      const response = await api.post('/fornecedor/', dadosFornecedor);
      
      // Animação de saída (opcional - igual ao cadastroCategoria)
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Alert.alert('Sucesso', 'Fornecedor cadastrado com sucesso!', [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]);
      });

    } catch (error) {
      console.error('Erro ao cadastrar fornecedor:', error);
      
      // Tratamento de erros específicos
      let errorMessage = 'Falha ao cadastrar fornecedor';
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'CPF/CNPJ já cadastrado';
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
    <SafeAreaView style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Fornecedor</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => navigation.goBack()}
              />
            </View>

            {/* Nome */}
            <TextInput
              label="Nome*"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="account" />}
              autoComplete="off"
              autoCapitalize="words"
            />

            {/* CPF/CNPJ */}
            <TextInput
              label="CPF/CNPJ*"
              value={cpfCnpj}
              onChangeText={handleCpfCnpjChange}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              maxLength={18}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="card-account-details" />}
              autoComplete='off'
              autoCorrect={false}
              autoCapitalize='none'
              importantForAutofill='no'
            />

            {/* Telefone */}
            <TextInput
              label="Telefone*"
              value={telefone}
              onChangeText={(text) => setTelefone(formatPhone(text))}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={15}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="phone" />}
            />

            {/* Email */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="email-outline" />}
            />

            {/* Observação */}
            <TextInput
              label="Observações"
              value={observacao}
              onChangeText={setObservacao}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 100 }]}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="note-outline" />}
            />

            {/* Botão de cadastro */}
            <Button
              mode="contained"
              onPress={cadastrarFornecedor}
              style={styles.button}
              buttonColor="#4CAF50"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                'Adicionar Fornecedor'
              )}
            </Button>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    paddingTop: 90,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
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