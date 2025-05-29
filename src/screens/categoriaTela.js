import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CategoriaTela({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.voltar}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.title}>
            Listar{"\n"}
            <Text style={styles.bold}>Categorias de Produtos</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#aaa" style={{ marginLeft: 8 }} />
          <TextInput placeholder="Pesquisar..." style={styles.input} />
        </View>

        <Text style={styles.message}>
          Você ainda não cadastrou. Aperte o botão abaixo para realizar seu primeiro cadastro.
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastroCategoria')}>
          <Ionicons name="add" size={32} color="white" />
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
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.047,
    paddingBottom: height * 0.2,
    backgroundColor: '#fff',
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  title: {
    fontSize: width * 0.038,
    marginLeft: width * 0.042,
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
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: width * 0.02,
  },
  message: {
    marginTop: height * 0.007,
    fontSize: width * 0.036,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? height * 0.12 : height * 0.12,
    right: width * 0.08,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});