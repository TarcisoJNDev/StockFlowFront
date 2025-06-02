import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function UsuarioTela({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.voltar}
      >
        <Ionicons
          name="arrow-back"
          size={width * 0.06}
          color="black"
        />
        <Text style={styles.title}>
          Listar{"\n"}
          <Text style={styles.bold}>Usuario</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={width * 0.05}
          color="#aaa"
          style={{ marginLeft: width * 0.02 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.qrButton}>
          <Ionicons
            name="qr-code-outline"
            size={width * 0.06}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Você ainda não cadastrou. Aperte o botão abaixo para realizar seu primeiro cadastro.
      </Text>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroUsuario')}
      >
        <Ionicons
          name="add"
          size={width * 0.08}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    paddingTop: height * 0.045,
    backgroundColor: '#fff',
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.04,
    marginLeft: width * 0.03,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    height: height * 0.06,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
  },
  qrButton: {
    marginRight: width * 0.02,
  },
  infoText: {
    marginTop: height * 0.01,
    color: '#666',
    fontSize: width * 0.036,
    textAlign: 'left',
    paddingHorizontal: width * 0.01,
  },
  fab: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    bottom: height * 0.14,
    backgroundColor: '#2ecc71',
    borderRadius: width * 0.075,
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});