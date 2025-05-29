import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="storefront" size={24} color="#fff" />
        </View>
        <View>
          <Text style={styles.welcome}>Olá, Nome de usuário</Text>
          <Text style={styles.company}>Nome da empresa</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Meu negócio</Text>
        <View style={styles.grid}>
          {[...Array(9)].map((_, index) => {
            if (index === 1) {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.square}
                  onPress={() => navigation.navigate('Estoque')}
                >
                  <MaterialIcons name="inventory" size={24} color="#333" />
                  <Text style={styles.cadastroText}>ESTOQUE</Text>
                </TouchableOpacity>
              );
            }
            return <View key={index} style={styles.square} />;
          })}
        </View>

        <Text style={styles.sectionTitle}>Cadastros</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('Produtos')}>
            <MaterialIcons name="qr-code" size={24} color="#333" />
            <Text style={styles.cadastroText}>PRODUTOS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('Clientes')}>
            <FontAwesome5 name="user-friends" size={24} color="#333" />
            <Text style={styles.cadastroText}>CLIENTES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('Fornecedor')}>
            <Ionicons name="business" size={24} color="#333" />
            <Text style={styles.cadastroText}>FORNECEDOR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('CategoriaTela')}>
            <MaterialIcons name="category" size={24} color="#333" />
            <Text style={styles.cadastroText}>Categorias</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('UsuarioTela')}>
            <FontAwesome5 name="users" size={24} color="#333" />
            <Text style={styles.cadastroText}>USUÁRIOS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    zIndex: 1,
    ...Platform.select({
      ios: {
        paddingTop: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 6,
        paddingTop: 40,
      },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  welcome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  company: {
    fontSize: 14,
    color: '#000',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  square: {
    width: width * 0.22,
    height: width * 0.22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cadastroText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});