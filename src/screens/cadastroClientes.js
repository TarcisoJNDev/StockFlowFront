import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleConfirmDate = (date) => {
    setDataNascimento(date.toISOString().split('T')[0]);
    setDatePickerVisible(false);
  };

  const handleSubmit = () => {
    const formData = {
      nome,
      cpfCnpj,
      telefone,
      email,
      dataNascimento,
      observacao,
      cep,
      uf,
      cidade,
      endereco,
      numero,
      bairro,
      complemento,
    };
    console.log(formData);
    navigation.goBack();
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
            />

            <TextInput
              label="CPF/CNPJ*"
              value={cpfCnpj}
              onChangeText={setCpfCnpj}
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="card-account-details-outline" />}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
            />

            <TextInput
              label="Telefone*"
              value={telefone}
              onChangeText={setTelefone}
              mode="outlined"
              style={styles.input}
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
              right={<TextInput.Icon icon="email-outline" />}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
            />

            <TextInput
              label="Data de Nascimento*"
              value={dataNascimento}
              mode="outlined"
              style={styles.input}
              editable={false}
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
                  onChangeText={setCep}
                  mode="outlined"
                  style={styles.input}
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
                  />
                  <TextInput
                    label="Cidade*"
                    value={cidade}
                    onChangeText={setCidade}
                    mode="outlined"
                    style={[styles.input, { flex: 2, marginLeft: 5 }]}
                    activeOutlineColor="#4CAF50"
                    outlineColor="#ccc"
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
                />

                <View style={styles.row}>
                  <TextInput
                    label="Número*"
                    value={numero}
                    onChangeText={setNumero}
                    mode="outlined"
                    style={[styles.input, { flex: 1, marginRight: 5 }]}
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
            >
              Adicionar
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