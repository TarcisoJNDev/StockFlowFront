import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform
} from 'react-native';

import imagemInicio from '../../../assets/images/imageInicio.png';
import logo from '../../../assets/icons/logo.png';
import iconWhats from '../../../assets/icons/whats.png';

const { width, height } = Dimensions.get('window');

export default function TelaInicial({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho com margem aumentada */}
        <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? 40 : 40 }]}>
          <Image style={styles.logo} source={logo} />
          <Text style={styles.appTitle}>StockFlow</Text>
        </View>


        {/* Imagem central */}
        <Image
          style={styles.mainImage}
          source={imagemInicio}
          resizeMode="contain"
        />

        {/* Slogan */}
        <Text style={styles.slogan}>
          O seu negócio {'\n'}
          na palma da sua mão
        </Text>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CriarConta')}
          >
            <Text style={styles.primaryButtonText}>Criar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Eu já tenho uma conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueButtonText}>Continuar sem criar conta</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé com margem reduzida */}
        <TouchableOpacity
          style={[styles.helpContainer, { marginBottom: 20 }]}
          onPress={() => navigation.navigate('AjudaWhats')}
        >
          <Image source={iconWhats} style={styles.whatsIcon} />
          <Text style={styles.helpText}>Precisa de ajuda?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 4,
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  mainImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // Mantém proporção quadrada
    marginTop: 0,
    marginBottom: 20,
  },
  slogan: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 30,
    color: '#333',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#28A745',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '500',
  },
  continueButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Reduzido de 30 para 20
  },
  whatsIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  helpText: {
    fontSize: 16,
    color: '#28A745',
    fontWeight: '500',
  },
});