import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Text,
  Animated,
  Platform,
  TouchableOpacity
} from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CadastroEstoque({ navigation }) {
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Estoque</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => navigation.goBack()}
            />
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
        
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={() => navigation.navigate('EntradaEstoque')}
              activeOpacity={0.7}
            >
              <Icon name="cart-arrow-down" size={24} color="#4CAF50" style={styles.icon} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Entrada de Estoque</Text>
                <Text style={styles.optionText}>
                  Utilize essa opção para cadastrar uma nova entrada de estoque de produto
                  para deixar o seu estoque atualizado!
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionCard}
              onPress={() => navigation.navigate('RetiradaEstoque')}
              activeOpacity={0.7}
            >
              <Icon name="cart-remove" size={24} color="#e74c3c" style={styles.icon} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Debitar</Text>
                <Text style={styles.optionText}>
                  Quebrou, cadastrou errado, venceu? Utilize essa opção para debitar do estoque sem refletir no financeiro
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    width: '100%',
    position: 'absolute',
    bottom: 0,      
    maxHeight: '70%',
    height: 425,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  optionText: {
    fontSize: 14,
    color: '#555',
  },
});