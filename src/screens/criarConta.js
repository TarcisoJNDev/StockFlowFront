import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../services/api'; // Importe sua instância do axios

export default function CriarConta({ navigation }) {
  // Estados (mantidos os mesmos)
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs para rolagem automática
  const scrollViewRef = useRef();
  const inputRefs = {
    nome: useRef(),
    telefone: useRef(),
    email: useRef(),
    senha: useRef(),
    confirmarSenha: useRef(),
    nomeLoja: useRef()
  };

  // Função para formatar o telefone no padrão (XX) XXXXX-XXXX
  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, '');

    let formattedText = '';
    if (cleaned.length > 0) {
      formattedText = (`${cleaned.substring(0, 2)}`);
    }
    if (cleaned.length > 2) {
      formattedText = (`(${formattedText}) ${cleaned.substring(2, 7)}`);
    }
    if (cleaned.length > 7) {
      formattedText = (`${formattedText}-${cleaned.substring(7, 11)}`);
    }

    setTelefone(formattedText);
  };

  // Função corrigida para rolar até o input quando focado
  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
    setTimeout(() => {
      const inputRef = inputRefs[inputName].current;
      if (inputRef && inputRef.measure) {
        inputRef.measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
        });
      }
    }, 100);
  };

  // Função assíncrona seguindo seu modelo
  const salvarUsuario = async () => {
    try {
      setLoading(true);
      const telefoneSemMascara = telefone.replace(/\D/g, '');

      const novoUsuario = {
        nome,
        telefone: telefoneSemMascara,
        email,
        senha, // ATENÇÃO: Nunca logue senhas em produção!
        nomeLoja,
      };

      // SIMULAÇÃO - REMOVA DEPOIS DOS TESTES
      console.log("📤 Dados que seriam enviados:", novoUsuario);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de rede
      console.log("✅ Simulação: Cadastro realizado com sucesso!");
      // FIM DA SIMULAÇÃO

      Alert.alert('Sucesso', 'Cadastro simulado - veja os dados no console');
      navigation.navigate('Home');

    } catch (error) {
      console.error('Erro simulado:', error);
    } finally {
      setLoading(false);
    }
  };
  // const salvarUsuario = async () => {
  //   try {
  //     setLoading(true);
  //     // Remove máscara do telefone
  //     const telefoneSemMascara = telefone.replace(/\D/g, '');

  //     const novoUsuario = {
  //       nome: nome,
  //       telefone: telefoneSemMascara,
  //       email: email,
  //       senha: senha,
  //       nomeLoja: nomeLoja,
  //     };

  //     const response = await api.post('/usuario/', novoUsuario);
  //     console.log('Usuário cadastrado com sucesso:', response.data);

  //     Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
  //     navigation.navigate('Home');

  //   } catch (error) {
  //     console.error('Erro ao cadastrar usuário:', error);
  //     Alert.alert('Erro', error.response?.data?.message || 'Erro ao cadastrar usuário');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Função de validação e submissão
  const handleCadastro = () => {
    if (!termsAccepted) {
      Alert.alert('Atenção', 'Você precisa aceitar os termos de uso');
      return;
    }

    if (!nome) {
      Alert.alert('Atenção', 'Por favor, insira seu nome completo');
      return;
    }

    if (telefone.length < 15) {
      Alert.alert('Atenção', 'Por favor, insira um telefone válido');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Atenção', 'Por favor, insira um e-mail válido');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem!');
      return;
    }

    if (!nomeLoja) {
      Alert.alert('Atenção', 'Por favor, insira o nome da sua loja');
      return;
    }

    salvarUsuario();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >


        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo para começar</Text>

        {/* Campo Nome Completo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome completo</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'nome' && { borderColor: '#00C851' }
          ]}>
            <Icon name="person" size={20} color="#888" style={styles.icon} />
            <TextInput
              ref={inputRefs.nome}
              style={styles.input}
              placeholder="Insira seu nome completo"
              value={nome}
              onChangeText={setNome}
              onFocus={() => handleFocus('nome')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => inputRefs.telefone.current?.focus()}
            />
          </View>
        </View>

        {/* Campo Telefone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'telefone' && { borderColor: '#00C851' }
          ]}>
            <Icon name="phone" size={20} color="#888" style={styles.icon} />
            <TextInput
              ref={inputRefs.telefone}
              style={styles.input}
              placeholder="(00) 00000-0000"
              value={telefone}
              onChangeText={formatPhone}
              onFocus={() => handleFocus('telefone')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="phone-pad"
              maxLength={15}
              returnKeyType="next"
              onSubmitEditing={() => inputRefs.email.current?.focus()}
            />
          </View>
        </View>

        {/* Campo E-mail */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'email' && { borderColor: '#00C851' }
          ]}>
            <Icon name="email" size={20} color="#888" style={styles.icon} />
            <TextInput
              ref={inputRefs.email}
              style={styles.input}
              placeholder="Insira seu e-mail"
              value={email}
              onChangeText={setEmail}
              onFocus={() => handleFocus('email')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => inputRefs.senha.current?.focus()}
            />
          </View>
        </View>

        {/* Campo Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'senha' && { borderColor: '#00C851' }
          ]}>
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              ref={inputRefs.senha}
              style={styles.input}
              placeholder="Crie uma senha segura"
              value={senha}
              onChangeText={setSenha}
              onFocus={() => handleFocus('senha')}
              onBlur={() => setFocusedInput(null)}
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => inputRefs.confirmarSenha.current?.focus()}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo Confirmar Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar senha</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'confirmarSenha' && { borderColor: '#00C851' }
          ]}>
            <Icon name="lock-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              ref={inputRefs.confirmarSenha}
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              onFocus={() => handleFocus('confirmarSenha')}
              onBlur={() => setFocusedInput(null)}
              secureTextEntry={!showConfirmPassword}
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => inputRefs.nomeLoja.current?.focus()}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo Nome da Loja */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome da loja</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'nomeLoja' && { borderColor: '#00C851' }
          ]}>
            <Icon name="store" size={20} color="#888" style={styles.icon} />
            <TextInput
              ref={inputRefs.nomeLoja}
              style={styles.input}
              placeholder="Insira o nome da sua loja"
              value={nomeLoja}
              onChangeText={setNomeLoja}
              onFocus={() => handleFocus('nomeLoja')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Termos e condições */}
        <View style={styles.termsContainer}>
          <Checkbox
            status={termsAccepted ? 'checked' : 'unchecked'}
            onPress={() => setTermsAccepted(!termsAccepted)}
            color="#00C851"
          />
          <Text style={styles.termsText}>
            Concordo com os Termos de Uso e Política de Privacidade
          </Text>
        </View>

        {/* Botão de continuar */}
        <TouchableOpacity
          style={[styles.button, (!termsAccepted || loading) && styles.disabledButton]}
          onPress={handleCadastro}
          disabled={!termsAccepted || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar conta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#00C851',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});