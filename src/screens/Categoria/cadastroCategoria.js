import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import api from '../../services/api';

export default function CadastroCategoria({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const keyboardHeight = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    // Animação de entrada (subida + fade in)
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();

    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      keyboardHeight.current = e.endCoordinates.height;
      Animated.timing(slideAnim, {
        toValue: -keyboardHeight.current + 100,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
    
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleInputPress = () => {
    inputRef.current?.focus();
  };

  const cadastrarCategoria = async () => {
  try {
    setLoading(true);
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome da categoria');
      return;
    }
    // Chamada real para a API
    const response = await api.post('/categoria/', {
      nome: titulo 
    });

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      Alert.alert('Sucesso', 'Categoria cadastrada com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]);
    });
    
  } catch (error) {
    console.error('Erro ao cadastrar categoria:', error);
    Alert.alert('Erro', error.response?.data?.message || 'Falha ao cadastrar categoria');
  } finally {
    setLoading(false);
  }
};

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        navigation.goBack();
      }}>
        <View style={styles.overlayBackground} />
      </TouchableWithoutFeedback>
      
      <Animated.View style={[styles.modalContent, { 
        transform: [{ translateY: slideAnim }],
      }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Categorias</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => navigation.goBack()}
          />
        </View>

        <TouchableWithoutFeedback onPress={handleInputPress}>
          <View>
            <TextInput
              ref={inputRef}
              label="Nome da Categoria*"
              value={titulo}
              onChangeText={setTitulo}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="tag-outline" />}
              autoComplete="off"
              autoCapitalize="words"
            />
          </View>
        </TouchableWithoutFeedback>

        <Button
          mode="contained"
          onPress={cadastrarCategoria}
          style={styles.button}
          buttonColor="#4CAF50"
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : 'Adicionar Categoria'}
        </Button>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayBackground: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    width: '100%',
    minHeight: Dimensions.get('window').height * 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
  },
});