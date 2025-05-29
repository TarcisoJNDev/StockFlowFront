import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import imagemInicio from '../../assets/imageInicio.png';
import logo from '../../assets/logo.png';
import iconWhats from '../../assets/whats.png';

const { width, height } = Dimensions.get('window');

export default function TelaInicial({ navigation }) {
  return (
    <View style={styles.container}>
      <Image style={styles.imagemlogo} source={logo} />
      <Text style={styles.textoLogo}>StockFlow</Text>
      <Image style={styles.imagem} source={imagemInicio} />
      <Text style={styles.textoFrase}>O seu negócio {'\n'} na palma da sua mão</Text>

      <TouchableOpacity onPress={() => navigation.navigate('CriarConta')} style={styles.botao}>
        <Text style={styles.textoPrincipal}>Criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.botao2}>
        <Text style={styles.textoPrincipal2}>Eu já tenho uma conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoContinuar} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.textoContinuar}>Continuar sem criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ajudaContainer} onPress={() => navigation.navigate('AjudaWhats')} >
        <Image style={styles.iconWhatsapp} source={iconWhats} />
        <Text style={styles.textoAjuda}>Precisa de ajuda?</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemlogo: {
    position: 'absolute',
    top: height * 0.064,
    left: width * 0.06,
    height: 28,
    width: 28,
  },
  textoLogo: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.152,
    fontSize: 24,
    fontWeight: 'bold',
  },
  imagem: {
    height: height * 0.50,
    width: width * 0.90,
    resizeMode: 'contain',
    marginTop: 30,
  },
  textoFrase: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  botao: {
    backgroundColor: '#28A745',
    paddingVertical: 16,
    paddingHorizontal: width * 0.32,
    borderRadius: 10,
    marginBottom: 10,
  },
  textoPrincipal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  botao2: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: width * 0.193,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C9C9C9',
    marginBottom: 15,
  },
  textoPrincipal2: {
    fontSize: 20,
    color: '#909090',
  },
  botaoContinuar: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoContinuar: {
    fontSize: 16,
    color: '#333',
  },
  ajudaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  iconWhatsapp: {
    height: 22,
    width: 22,
    marginRight: 8,
  },
  textoAjuda: {
    fontSize: 16,
    color: '#28A745',
  }
});
