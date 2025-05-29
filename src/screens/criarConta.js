import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function CriarConta({ navigation }) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const renderInput = (label, placeholder, secureTextEntry, iconName, keyboardType) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        focusedInput === label && { borderColor: '#00C851' }
      ]}>
        <Icon name={iconName} size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setFocusedInput(label)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Vamos lá</Text>
      <Text style={styles.subtitle}>Primeiro vamos pesquisar o seu nome</Text>

      {renderInput('Nome', 'Digite seu nome', false, 'person')}
      {renderInput('Senha', 'Digite sua senha', true, 'lock')}
      {renderInput('Confirmar Senha', 'Confirme sua senha', true, 'lock-outline')}
      {renderInput('Telefone', 'Digite seu telefone', false, 'phone', 'phone-pad')}
      {renderInput('E-mail', 'Digite seu e-mail', false, 'email', 'email-address')}
      {renderInput('Nome da loja', 'Nome da loja', false, 'store')}

      <View style={styles.termsContainer}>
        <Checkbox
          status={termsAccepted ? 'checked' : 'unchecked'}
          onPress={() => setTermsAccepted(!termsAccepted)}
          color="#00C851"
        />
        <Text style={styles.termsText}>
          Eu li e aceito os termos de uso e política de privacidade.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !termsAccepted && styles.disabledButton]}
        onPress={() => {
          if (termsAccepted) {
            navigation.navigate('Home');
          } else {
            alert('Você precisa aceitar os termos para continuar.');
          }
        }}
        disabled={!termsAccepted}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  backButton: {
    marginTop: 20,
  },
  backText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    color: '#444',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#00C851',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
