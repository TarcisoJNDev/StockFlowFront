import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ActivityIndicator
} from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

export default function CadastroClientes({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [mostrarEndereco, setMostrarEndereco] = useState(false);

  const formatDateInput = (text) => {
    let cleaned = text.replace(/\D/g, '');

    let formatted = '';
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += '/' + cleaned.substring(2, 4);
    }
    if (cleaned.length > 4) {
      formatted += '/' + cleaned.substring(4, 8);
    }

    return formatted;
  };

  const parseDateFromText = (text) => {
    const [day, month, year] = text.split('/').map(Number);
    if (day && month && year) {
      return new Date(year, month - 1, day);
    }
    return null;
  };

  const handleConfirmDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = (`${day}/${month}/${year}`);
    setDataNascimento(formattedDate);
    setDatePickerVisible(false);
  };

  const handleDateBlur = () => {
    const date = parseDateFromText(dataNascimento);
    if (!date || isNaN(date.getTime())) {
      Alert.alert('Data inválida', 'Por favor, insira uma data válida no formato DD/MM/AAAA');
      setDataNascimento('');
    }
  };

  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const cadastrarCliente = async () => {
    try {
      setLoading(true);
      if (!nome) {
        Alert.alert('Atenção', 'Por favor, informe o nome do cliente');
        return;
      }

      if (!cpfCnpj) {
        Alert.alert('Atenção', 'Por favor, informe o CPF/CNPJ');
        return;
      }
      const cleanedCpfCnpj = cpfCnpj.replace(/\D/g, '');
      const isCpf = cleanedCpfCnpj.length <= 11;

      let formattedDate = '';
      if (dataNascimento) {
        const [day, month, year] = dataNascimento.split('/');
        formattedDate = (`${year}-${month}-${day}`);
      }

      const dadosCliente = {
        nome,
        tipoCliente: isCpf ? "PF" : "PJ",
        cpf: isCpf ? cleanedCpfCnpj : null,
        cnpj: !isCpf ? cleanedCpfCnpj : null,
        email: email || "",
        dataNascimento: formattedDate,
        observacao: observacao || ""
      };

      const response = await api.post('/cliente/', dadosCliente);

      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      });

    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);

      let errorMessage = 'Falha ao cadastrar cliente';
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

  const handleSubmit = () => {
    if (!nome) {
      Alert.alert('Atenção', 'Por favor, informe o nome do cliente');
      return;
    }
    if (!cpfCnpj) {
      Alert.alert('Atenção', 'Por favor, informe o CPF/CNPJ');
      return;
    }
    if (mostrarEndereco && !cep) {
      Alert.alert('Atenção', 'Por favor, informe o CEP');
      return;
    }
    cadastrarCliente();
  };

  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleaned.length > 0) {
      formattedText = (`(${cleaned.substring(0, 2)})`);
    }
    if (cleaned.length > 2) {
      formattedText = (`${formattedText} ${cleaned.substring(2, 7)}`);
    }
    if (cleaned.length > 7) {
      formattedText = (`${formattedText}-${cleaned.substring(7, 11)}`);
    }
    return formattedText;
  };

  const formatCPF = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleaned.length > 0) {
      formattedText = (`${cleaned.substring(0, 3)}`);
    }
    if (cleaned.length > 3) {
      formattedText = (`${formattedText}.${cleaned.substring(3, 6)}`);
    }
    if (cleaned.length > 6) {
      formattedText = (`${formattedText}.${cleaned.substring(6, 9)}`);
    }
    if (cleaned.length > 9) {
      formattedText = (`${formattedText}-${cleaned.substring(9, 11)}`);
    }
    return formattedText;
  };

  const formatCNPJ = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleaned.length > 0) {
      formattedText = (`${cleaned.substring(0, 2)}`);
    }
    if (cleaned.length > 2) {
      formattedText = (`${formattedText}.${cleaned.substring(2, 5)}`);
    }
    if (cleaned.length > 5) {
      formattedText = (`${formattedText}.${cleaned.substring(5, 8)}`);
    }
    if (cleaned.length > 8) {
      formattedText = (`${formattedText}/${cleaned.substring(8, 12)}`);
    }
    if (cleaned.length > 12) {
      formattedText = (`${formattedText}-${cleaned.substring(12, 14)}`);
    }

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

  const formatCEP = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleaned.length > 0) {
      formattedText = (`${cleaned.substring(0, 5)}`);
    }
    if (cleaned.length > 5) {
      formattedText = (`${formattedText}-${cleaned.substring(5, 8)}`);
    }

    return formattedText;
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>

          <View style={styles.header}>
            <Text style={styles.title}>Clientes</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => navigation.goBack()}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

            <TextInput
              label="Nome*"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="account" />}
              autoCapitalize="words"
            />

            <TextInput
              label="CPF/CNPJ*"
              value={cpfCnpj}
              onChangeText={handleCpfCnpjChange}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              maxLength={18}
              right={<TextInput.Icon icon="card-account-details-outline" />}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              autoComplete='off'
              autoCorrect={false}
              autoCapitalize='none'
              importantForAutofill='no'
            />

            <TextInput
              label="Telefone*"
              value={telefone}
              onChangeText={(text) => setTelefone(formatPhone(text))}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={15}
              right={<TextInput.Icon icon="phone" />}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
            />

            <TextInput
              label="Email*"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              right={<TextInput.Icon icon="email-outline" />}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
            />

            <TextInput
              label="Data de Nascimento*"
              value={dataNascimento}
              onChangeText={(text) => setDataNascimento(formatDateInput(text))}
              onBlur={handleDateBlur}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              maxLength={10}
              placeholder="DD/MM/AAAA"
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={() => setDatePickerVisible(true)}
                />
              }
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
            />

            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={() => setDatePickerVisible(false)}
              maximumDate={new Date()}
            />

            <TextInput
              label="Observação"
              value={observacao}
              onChangeText={setObservacao}
              mode="outlined"
              style={[styles.input, { height: 100 }]}
              multiline
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
            />

            <View style={styles.header}>
              <Text style={styles.sectionTitle}>Endereço</Text>
              <IconButton
                icon={mostrarEndereco ? 'minus' : 'plus'}
                onPress={() => setMostrarEndereco(!mostrarEndereco)}
              />
            </View>

            {mostrarEndereco && (
              <>
                <TextInput
                  label="CEP*"
                  value={cep}
                  onChangeText={(text) => setCep(formatCEP(text))}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={9}
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                />

                <View style={styles.row}>
                  <TextInput
                    label="UF*"
                    value={uf}
                    onChangeText={setUf}
                    mode="outlined"
                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                    activeOutlineColor="#4CAF50"
                    outlineColor="#ccc"
                    maxLength={2}
                    autoCapitalize="characters"
                  />

                  <TextInput
                    label="Cidade*"
                    value={cidade}
                    onChangeText={setCidade}
                    mode="outlined"
                    style={[styles.input, { flex: 2, marginLeft: 5 }]}
                    activeOutlineColor="#4CAF50"
                    outlineColor="#ccc"
                    autoCapitalize="words"
                  />
                </View>

                <TextInput
                  label="Endereço*"
                  value={endereco}
                  onChangeText={setEndereco}
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                  autoCapitalize="words"
                />

                <View style={styles.row}>
                  <TextInput
                    label="Número*"
                    value={numero}
                    onChangeText={setNumero}
                    mode="outlined"
                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                    keyboardType="numeric"
                    activeOutlineColor="#4CAF50"
                    outlineColor="#ccc"
                  />
                  <TextInput
                    label="Bairro*"
                    value={bairro}
                    onChangeText={setBairro}
                    mode="outlined"
                    style={[styles.input, { flex: 2, marginLeft: 5 }]}
                    activeOutlineColor="#4CAF50"
                    outlineColor="#ccc"
                    autoCapitalize="words"
                  />
                </View>

                <TextInput
                  label="Complemento"
                  value={complemento}
                  onChangeText={setComplemento}
                  mode="outlined"
                  style={styles.input}
                  activeOutlineColor="#4CAF50"
                  outlineColor="#ccc"
                />
              </>
            )}


            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              buttonColor="#4CAF50"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                'Adicionar'
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
    backgroundColor: 'rgba(120, 120, 120, 0.4)',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 20,
    padding: 8,
    borderRadius: 8,
  },
});