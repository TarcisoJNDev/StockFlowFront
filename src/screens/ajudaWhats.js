import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AjudaWhats({ navigation }) {
  const [mensagem, setMensagem] = useState('Oi! Estou com dificuldade no app StockFlow');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleVoltar = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.fullScreen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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

          <ScrollView
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
          >
           
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <View style={[styles.footerContainer, { bottom: keyboardHeight }]}>
        <SafeAreaView edges={['bottom']} style={styles.footerSafeArea}>
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
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#ece5dd',
  },
  safeArea: {
    flex: 1,
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
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  footerSafeArea: {
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  plusButton: {
    padding: 6,
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