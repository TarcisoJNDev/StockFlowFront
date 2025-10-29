import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function ProdutoTela({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraType, setCameraType] = useState('back');

  // Solicitar permissão da câmera
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  // Função chamada quando um QR Code é escaneado
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setModalVisible(false);

    // Processa os dados do QR Code
    processQRCodeData(data);
  };

  // Processa os dados do QR Code
  const processQRCodeData = (data) => {
    try {
      console.log('QR Code escaneado:', data);

      // Tenta parsear como JSON (se o QR Code for um objeto)
      let productData;
      try {
        productData = JSON.parse(data);
      } catch {
        // Se não for JSON, trata como string simples (código de barras, etc)
        productData = { codigo: data };
      }

      // Mostra alerta com os dados escaneados
      Alert.alert(
        'QR Code Escaneado!',
        `Dados: ${typeof productData === 'object' ? JSON.stringify(productData) : productData}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Aqui você pode navegar para uma tela de detalhes do produto
              // ou fazer uma busca na API com os dados escaneados
              if (productData.codigo) {
                buscarProdutoPorCodigo(productData.codigo);
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao processar QR Code:', error);
      Alert.alert('Erro', 'Não foi possível processar o QR Code escaneado.');
    }
  };

  // Função para buscar produto na API (exemplo)
  const buscarProdutoPorCodigo = async (codigo) => {
    try {
      // Aqui você faria a chamada para sua API
      console.log('Buscando produto com código:', codigo);

      // Exemplo de navegação para detalhes do produto
      // navigation.navigate('DetalhesProduto', { codigo });

      Alert.alert('Busca', `Buscando produto: ${codigo}`);
    } catch (error) {
      Alert.alert('Erro', 'Produto não encontrado');
    }
  };

  // Reinicia o scanner
  const resetScanner = () => {
    setScanned(false);
  };

  // Alterna entre câmera frontal e traseira
  const toggleCameraType = () => {
    setCameraType(
      cameraType === 'back' ? 'front' : 'back'
    );
  };

  // Modal do leitor de QR Code
  const renderQRCodeModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        {/* Header do Modal */}
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={width * 0.07} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Escaneie o QR Code</Text>
          <TouchableOpacity
            onPress={toggleCameraType}
            style={styles.flipButton}
          >
            <Ionicons name="camera-reverse" size={width * 0.06} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Área da Câmera */}
        <View style={styles.cameraContainer}>
          {hasPermission === null ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
            </View>
          ) : hasPermission === false ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="camera-off" size={width * 0.15} color="#666" />
              <Text style={styles.permissionText}>Sem acesso à câmera</Text>
              <Text style={styles.permissionSubtext}>
                Para escanear QR Codes, permita o acesso à câmera nas configurações do app
              </Text>
            </View>
          ) : (
            <CameraView
              style={styles.camera}
              facing={cameraType}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417", "ean13", "ean8", "upc_e", "code39", "code128"]
              }}
            >
              {/* Overlay do scanner */}
              <View style={styles.overlay}>
                <View style={styles.scanFrame}>
                  <View style={styles.cornerTopLeft} />
                  <View style={styles.cornerTopRight} />
                  <View style={styles.cornerBottomLeft} />
                  <View style={styles.cornerBottomRight} />
                </View>
                <Text style={styles.scanText}>Posicione o QR Code dentro do quadro</Text>

                {scanned && (
                  <TouchableOpacity
                    style={styles.rescanButton}
                    onPress={resetScanner}
                  >
                    <Text style={styles.rescanText}>Escanear Novamente</Text>
                  </TouchableOpacity>
                )}
              </View>
            </CameraView>
          )}
        </View>

        {/* Rodapé do Modal */}
        <View style={styles.modalFooter}>
          <Text style={styles.footerText}>
            O QR Code será escaneado automaticamente
          </Text>
        </View>
      </View>
    </Modal>
  );

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
          Listar{"\n"}
          <Text style={styles.bold}>Produto</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={width * 0.05}
          color="#aaa"
          style={{ marginLeft: width * 0.02 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="qr-code-outline"
            size={width * 0.06}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Você ainda não cadastrou. Aperte o botão abaixo para realizar seu primeiro cadastro.
      </Text>

      {/* Modal do QR Code */}
      {renderQRCodeModal()}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroProduto')}
      >
        <Ionicons
          name="add"
          size={width * 0.08}
          color="#fff"
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    height: height * 0.06,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
  },
  qrButton: {
    marginRight: width * 0.02,
    padding: width * 0.01,
  },
  infoText: {
    marginTop: height * 0.01,
    color: '#666',
    fontSize: width * 0.036,
    textAlign: 'left',
    paddingHorizontal: width * 0.01,
  },
  fab: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#4CAF50',
    borderRadius: width * 0.075,
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  // Estilos do Modal do QR Code
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    paddingTop: height * 0.05,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: width * 0.02,
  },
  flipButton: {
    padding: width * 0.02,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: width * 0.1,
  },
  permissionText: {
    color: '#fff',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.02,
  },
  permissionSubtext: {
    color: '#ccc',
    fontSize: width * 0.035,
    textAlign: 'center',
    marginTop: height * 0.01,
    lineHeight: height * 0.025,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4CAF50',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4CAF50',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4CAF50',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4CAF50',
  },
  scanText: {
    color: '#fff',
    fontSize: width * 0.04,
    marginTop: height * 0.05,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: width * 0.03,
    borderRadius: width * 0.02,
  },
  rescanButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    marginTop: height * 0.03,
  },
  rescanText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: width * 0.05,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
});