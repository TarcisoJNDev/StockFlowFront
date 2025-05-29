import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClientesTela({ navigation }) {
  const fornecedores = [
    { id: '1', nome: 'Nome do Cliente' },
    
  ];

  return (
    <View style={styles.container}>

      <Text></Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>Listar{"\n"}<Text style={styles.bold}>Clientes</Text></Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" style={{ marginLeft: 8 }} />
        <TextInput placeholder="Pesquisar..." style={styles.input} />
      </View>

      <FlatList
        data={fornecedores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text>{item.nome}</Text>
            <Ionicons name="chevron-forward" size={20} color="green" />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastroClientes')}>
        <Ionicons name="add" size={32} color="white" />
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
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 5,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    elevation: 1,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});