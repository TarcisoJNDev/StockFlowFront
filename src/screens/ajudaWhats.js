import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AjudaWhats({ navigation }) {
  const [mensagem, setMensagem] = useState('Oi! Estou com dificuldade no app StockFlow');

  const handleVoltar = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleVoltar} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' }}
            style={styles.profilePic}
          />
          <Text style={styles.headerTitle}>StockFlow</Text>
        </View>

        <ScrollView contentContainerStyle={styles.chatContent} />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.plusButton}>
            <Ionicons name="add" size={24} color="#555" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem"
            placeholderTextColor="#888"
            multiline
            value={mensagem}
            onChangeText={setMensagem}
          />

          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ece5dd',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#075e54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  plusButton: {
    padding: 6,
    justifyContent: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#075e54',
    borderRadius: 20,
    padding: 10,
  },
});
