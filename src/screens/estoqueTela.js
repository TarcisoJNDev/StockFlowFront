// TelaEstoque.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function EstoqueTela({ navigation }) {
  const [pesquisa, setPesquisa] = useState('');

  const produtos = [
    { id: '1', nome: 'Produto (Exemplo)' },

  ];

  return (
    <View style={styles.container}>

      <Text></Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>Controle de{"\n"}<Text style={styles.bold}>Produtos</Text></Text>
      </TouchableOpacity>

      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#aaa" style={{ marginLeft: 8 }} />
          <TextInput
            placeholder="Pesquisar produto..."
            style={styles.input}
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>

        <TouchableOpacity style={styles.iconButton} >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('FiltroEstoque')} >
          <Ionicons name="filter-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text>{item.nome}</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastroEstoque')}>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 5,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 5,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
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
