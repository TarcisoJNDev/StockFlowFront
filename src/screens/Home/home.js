import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Objeto que define quais botões estão inativos
const disabledButtons = {
  0: true, // Pedidos
  2: true, // Caixa
  3: true, // Relatórios
  4: true, // Saúde
  5: true, // Fiados
  6: true, // Configurações
  7: true, // Versão Web
  8: true  // Meu Catálogo
};

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
            const isDisabled = disabledButtons[index];

            switch (index) {
              case 0: // Pedidos
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                  >
                    <MaterialCommunityIcons name="clipboard-list" size={24} color="#3498db" />
                    <Text style={[styles.cadastroText, isDisabled && styles.disabledText]}>PEDIDOS</Text>
                  </TouchableOpacity>
                );
              case 1: // Estoque
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.square}
                    onPress={() => navigation.navigate('Estoque')}
                  >
                    <MaterialCommunityIcons name="package-variant" size={24} color="#FF7D33" />
                    <Text style={styles.cadastroText}>ESTOQUE</Text>
                  </TouchableOpacity>
                );

              case 2: // Caixa
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                  >
                    <MaterialCommunityIcons name="cash-register" size={24} color="#2ecc71" />
                    <Text style={[styles.cadastroText, isDisabled && styles.disabledText]}>CAIXA</Text>
                  </TouchableOpacity>
                );
              case 3: // Relatórios
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                  >
                    <MaterialIcons name="assessment" size={24} color="#e74c3c" />
                    <Text style={[styles.cadastroText, isDisabled && styles.disabledText]}>RELATÓRIOS</Text>
                  </TouchableOpacity>
                );
              case 4: // Saúde
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                  >
                    <FontAwesome5 name="heartbeat" size={24} color="#9b59b6" />
                    <Text style={[styles.cadastroText, isDisabled && styles.disabledText]}>SAÚDE</Text>
                  </TouchableOpacity>
                );
              case 5: // Fiados
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square]}
                    onPress={() => navigation.navigate('FiadoTela')}
                  >
                    <MaterialIcons name="credit-card" size={24} color="#f39c12" />
                    <Text style={[styles.cadastroText]}>FIADOS</Text>
                  </TouchableOpacity>
                );
              case 6: // Configurações
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                  >
                    <Feather name="settings" size={24} color="#1abc9c" />
                    <Text style={[styles.cadastroText, isDisabled && styles.disabledText]}>CONFIGURAÇÕES</Text>
                  </TouchableOpacity>
                );
              case 7: // Versão Web
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                  >
                    <MaterialCommunityIcons name="web" size={24} color="#34495e" />
                    <Text style={[styles.cadastroText, isDisabled && styles.disabledText]}>VERSÃO WEB</Text>
                  </TouchableOpacity>
                );
              case 8: // Meu Catálogo
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.square, isDisabled && styles.disabledButton]}
                    disabled={isDisabled}
                  >
                    <MaterialIcons name="collections" size={24} color="#e67e22" />
                    <Text style={[styles.cadastroText, isDisabled && styles.disabledText]}>MEU CATÁLOGO</Text>
                  </TouchableOpacity>
                );
              default:
                return <View key={index} style={styles.square} />;
            }
          })}
        </View>

        {/* Seção Cadastros */}
        <Text style={styles.sectionTitle}>Cadastros</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('Produtos')}>
            <MaterialCommunityIcons name="barcode-scan" size={24} color="#4CAF50" />
            <Text style={styles.cadastroText}>PRODUTOS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('Clientes')}>
            <FontAwesome5 name="users" size={24} color="#2196F3" />
            <Text style={styles.cadastroText}>CLIENTES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('Fornecedor')}>
            <MaterialCommunityIcons name="truck-delivery" size={24} color="#9C27B0" />
            <Text style={styles.cadastroText}>FORNECEDOR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('CategoriaTela')}>
            <MaterialIcons name="category" size={24} color="#FF9800" />
            <Text style={styles.cadastroText}>CATEGORIAS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.square} onPress={() => navigation.navigate('UsuarioTela')}>
            <FontAwesome5 name="user-cog" size={24} color="#607D8B" />
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
    padding: width * 0.04,
    backgroundColor: '#fff',
    zIndex: 1,
    ...Platform.select({
      ios: {
        paddingTop: height * 0.06,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 6,
        paddingTop: height * 0.06,
      },
    }),
  },
  iconContainer: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.02,
  },
  welcome: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  company: {
    fontSize: width * 0.035,
    color: '#000',
  },
  container: {
    padding: width * 0.045,
    backgroundColor: '#fff',
    paddingBottom: height * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginVertical: height * 0.01,
    color: '#000',
    textAlign: 'left',
    paddingTop: height * 0.008,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  square: {
    width: width * 0.2353,
    height: width * 0.230,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: height * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cadastroText: {
    marginTop: height * 0.01,
    fontSize: width * 0.03,
    textAlign: 'center',
    color: '#333',
  },
  disabledButton: {
    opacity: 0.67,
  },
  disabledText: {
    color: '#999',
  },
});