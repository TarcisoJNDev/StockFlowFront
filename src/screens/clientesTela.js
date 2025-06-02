import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ClientesTela({ navigation }) {
  const fornecedores = [
    { id: '1', nome: 'Nome do Cliente' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')} 
        style={styles.voltar}
      >
        <Ionicons name="arrow-back" size={width * 0.06} color="black" />
        <Text style={styles.title}>Listar{"\n"}<Text style={styles.bold}>Clientes</Text></Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={width * 0.05} 
          color="#aaa" 
          style={{ marginLeft: width * 0.02 }} 
        />
        <TextInput 
          placeholder="Pesquisar..." 
          style={styles.input} 
          placeholderTextColor="#aaa"
        />
      </View>

      <FlatList
        data={fornecedores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>{item.nome}</Text>
            <Ionicons name="chevron-forward" size={width * 0.05} color="green" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('CadastroClientes')}
      >
        <Ionicons name="add" size={width * 0.08} color="white" />
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    height: height * 0.06,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginTop: height * 0.01,
    elevation: 1,
  },
  cardText: {
    fontSize: width * 0.04,
  },
  listContent: {
    paddingBottom: height * 0.1,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});