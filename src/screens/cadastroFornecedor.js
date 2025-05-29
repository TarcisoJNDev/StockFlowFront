import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  SafeAreaView, 
  Text 
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CadastroFornecedor({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacao, setObservacao] = useState('');

  const adicionarFornecedor = () => {
    console.log({
      nome,
      cpfCnpj,
      telefone,
      observacao
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.modalContent}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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

            <TextInput
              label="Nome*"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="CPF ou CNPJ*"
              value={cpfCnpj}
              onChangeText={setCpfCnpj}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="card-account-details" />}
            />

            <TextInput
              label="Telefone*"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#2ecc71"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="phone" />}
            />

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

            <Button
              mode="contained"
              onPress={adicionarFornecedor}
              style={styles.button}
              buttonColor="#2ecc71"
            >
              Adicionar
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '90%',
    height: '70%',
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