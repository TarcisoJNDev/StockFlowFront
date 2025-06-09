import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function EstoqueTela({ navigation }) {
  const [pesquisa, setPesquisa] = useState('');

  const produtos = [
    { id: '1', nome: 'Produto (Exemplo)' },
  ];

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
          Controle de{"\n"}
          <Text style={styles.bold}>Produtos</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons 
            name="search" 
            size={width * 0.05} 
            color="#aaa" 
            style={{ marginLeft: width * 0.02 }} 
          />
          <TextInput
            placeholder="Pesquisar produto..."
            style={styles.input}
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons 
            name="qrcode-scan" 
            size={width * 0.06} 
            color="#333" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.navigate('FiltroEstoque')}
        >
          <Ionicons 
            name="filter-outline" 
            size={width * 0.06} 
            color="#333" 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>{item.nome}</Text>
            <Ionicons 
              name="chevron-forward" 
              size={width * 0.05} 
              color="#333" 
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('CadastroEstoque')}
      >
        <Ionicons 
          name="add" 
          size={width * 0.08} 
          color="white" 
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.01,
    height: height * 0.06,
  },
  input: {
    flex: 1,
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
    height: '100%',
  },
  iconButton: {
    padding: width * 0.025,
    backgroundColor: '#eaeaea',
    borderRadius: width * 0.02,
    marginLeft: width * 0.01,
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
    backgroundColor: '#4CAF50',
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