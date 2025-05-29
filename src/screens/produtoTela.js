import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProdutoTela({ navigation }) {
  return (
    <View style={styles.container}>
      <Text></Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>Listar{"\n"}<Text style={styles.bold}>Produto</Text></Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.qrButton}>
          <Ionicons name="qr-code-outline" size={24} color="#777" />
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Você ainda não cadastrou. Aperte o botão abaixo para realizar seu primeiro cadastro.
      </Text>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroProduto')} // ou o nome da sua tela de cadastro
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: 'normal',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  qrButton: {
    marginLeft: 10,
  },
  infoText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#2ecc71',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
