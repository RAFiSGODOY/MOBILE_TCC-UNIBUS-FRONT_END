import React, { useState, useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import BackHome from '../../assets/semfundo.png';
import Loading2 from '../../components/Loading2';

export default function Contratos() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [userCpf, setUserCpf] = useState('');
    const [userTell, setUserTell] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [empresaNome, setEmpresaNome] = useState('');
    const [empresaEmail, setEmpresaEmail] = useState('');
    const [empresaTell, setEmpresaTell] = useState('');
    const [rotaInicio, setRotaInicio] = useState('');
    const [rotaFim, setRotaFim] = useState('');
    const [empresaEncontrada, setEmpresaEncontrada] = useState([]);
    const [mensagem, setMensagem] = useState('Usuário sem contrato ativo...')
    const [modalColor, setModalColor] = useState('#FF0000');
    const [showModal, setShowModal] = useState(false);
    const [errorTotais, setErrorTotais] = useState('');
    const [empresa, setEmpresa] = useState([]);
    const [animationPlayed, setAnimationPlayed] = useState(false);
    const route = useRoute();

    const showAndHideError = (message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#FF0000');
        setTimeout(() => {
          setShowModal(false);
          setErrorTotais('');
        },1500);
      };
    
      const showAndHideSuccess = (message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#00A925');
        setTimeout(() => {
          setShowModal(false);
          setErrorTotais('');
        }, 1500);
      };
      useEffect(() => {
        if (route.name === 'Home' && !animationPlayed) {
            setAnimationPlayed(true);
        }
    }, [route]);
    
    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log("passei aqui")
            if (token) {
                const userResponse = await api.get('/client', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserName(userResponse.data.nome);
                setUserCpf(userResponse.data.cpf);
                setUserEmail(userResponse.data.email);
                setUserTell(userResponse.data.telefone);

                const empresaResponse = await api.get('/contrato', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEmpresaNome(empresaResponse.data.nome);
                setEmpresaTell(empresaResponse.data.telefone);
                setEmpresaEmail(empresaResponse.data.email);
                if (empresaResponse.data.length > 0) {
                    setEmpresa(empresaResponse.data);
                    setEmpresaEncontrada(empresa);
                    setMensagem('');
                } else {
                    setEmpresa([]);
                    setMensagem('Nenhum Contrato Encontrado...');
                }
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
            if (error.response && error.response.status === 500) {
                console.log('Erro interno no servidor.');
                console.log('Error fetching user data:', error);
                showAndHideError("Contrate um Serviço");
            } else {
                console.log('Erro ao buscar os dados do usuário.');
                showAndHideError("Erro .");
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const formatarPreco = (preco) => {
        return `R$ ${preco.toFixed(2).replace('.', ',')}`;
    };
console.log(empresa)
    return (
        <SafeAreaView style={styles.container}>
            <Image source={BackHome} style={styles.backgroundImage} resizeMode='cover' />
            <Modal visible={showModal} transparent>
                <Animatable.View animation="fadeInDown" duration={300} style={styles.modalContainer}>
                    <Animatable.View animation="fadeInUp" duration={1000} style={[styles.modalContent, { backgroundColor: modalColor }]}>
                        <Text style={styles.modalMessage}>{errorTotais}</Text>
                    </Animatable.View>
                </Animatable.View>
            </Modal>
            <StatusBar barStyle="light-content" />
            {empresa != '' ? (
                <View>
                    <View style={styles.formHeader}>
                        <TouchableOpacity style={styles.configIcon} onPress={() => navigation.navigate('Configuracoes')}>
                            <Feather name="settings" size={22} color={'#fff'} style={styles.settingsIcon} />
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Olá, </Text>
                        <Text style={styles.usernameText}>{userName}</Text>
                    </View>
                    <View style={styles.infospessoais}>
                        <Feather name="phone" size={20} color={'#fff'} style={styles.PinValor} />
                        <Text style={styles.infoptext}>{userTell}</Text>
                    </View>
                    <View style={styles.infospessoais}>
                        <Feather name="lock" size={20} color={'#fff'} style={styles.PinValor} />
                        <Text style={styles.infoptext}>{userCpf}</Text>
                    </View>
                    <View style={styles.infospessoais}>
                        <Feather name="mail" size={20} color={'#fff'} style={styles.PinValor} />
                        <Text style={styles.infoptext}>{userEmail}</Text>
                    </View>
                    {/* Informações da empresa contratada */}
                    <Animatable.View
                        animation={animationPlayed ? 'fadeInLeft' : null}
                        duration={800}
                        style={styles.container1}
                    >
                        <View style={styles.empresacontratada}>
                            <Text style={styles.Nomeempresa}>Rafis Lc</Text>
                        </View>
                    </Animatable.View>
                    <Animatable.View
                        animation={animationPlayed ? 'fadeInRight' : null}
                        duration={800}
                        style={styles.container2}
                    >
                        <View style={styles.InfoEmpresaBack}>
                            <Text style={styles.InfosE}>Rafis Lc</Text>
                        </View>
                    </Animatable.View>
                </View>
            ) : (
                <Loading2/>
            )}
            <View style={styles.Navigator}>
            <TouchableOpacity style={styles.NavigationHome} onPress={() => navigation.navigate('Procurar')}>
            <Feather name="search" size={20} color={'#005C58'} style={styles.PinProcurar} />
              <Text style={styles.NavigationProcurarText}>Procurar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NavigationHome} onPress={() => navigation.navigate('Home')}>
            <Feather name="home" size={20} color={'#005C58'} style={styles.PinProcurar} />
              <Text style={styles.NavigationProcurarText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NavigationProcurar} onPress={() => navigation.navigate('Contratos')}>
            <Feather name="briefcase" size={20} color={'#fff'} style={styles.PinProcurar} />
              <Text style={styles.NavigationProcurarT}>Contratos</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Navigator:{
        flexDirection:'row',
        position:'absolute',
        marginTop:'197%',
        width:'100%',
        justifyContent:'space-around',
        backgroundColor:'transparent',
        padding:5,
    },
    NavigationProcurar:{
        backgroundColor:'rgba(0, 141, 134, 1)',
        width:'30%',
        borderRadius:5,
        padding:2,
    },
    NavigationHome:{
        backgroundColor:'#f0f0f0',
        width:'30%',
        borderRadius:5,
        padding:2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    PinProcurar:{
      alignSelf:'center',
    },
    NavigationProcurarText:{
      textAlign:'center',
      color:'#00413E',
      fontSize:10,
    },
    NavigationProcurarT:{
        textAlign:'center',
        color:'#ffff',
        fontSize:10,
      },
    mensagem:{
        color:'#00413E',
        textAlign:'center',
        marginTop:'70%',
    },
    noServiceImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    configIcon:{
        position:'absolute',
        width:'94%',
    },
    settingsIcon:{
      alignSelf:'flex-end',
    },
    
    backgroundImage:{
        width:'100%',
        height:'110%',
        position:'absolute',
    },
    PinValor:{
        marginRight:5,
    },
    infoptext:{
       color:'#EFEFEF',
    },
    infospessoais:{flexDirection:'row', marginLeft:5,marginTop:5,},
    container1:{
        marginTop:60,
        backgroundColor:'#ffff',
        padding:10,
        alignSelf:'center',
        borderRadius:5,
        width:'90%',
        height:200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    container2:{
        marginTop:30,
        backgroundColor:'#ffff',
        padding:10,
        height:200,
        alignSelf:'center',
        borderRadius:5,
        width:'90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    formHeader: {
        flexDirection:'row',
        marginTop:40,
        width:'100%',
        marginLeft:10,
        textAlign:'center',
        paddingBottom:4,
        paddingTop:10,
    },
    empresacontratada:{
        
    },
    InfoEmpresaBack:{
        
    },
    InfoEmpresa:{
        color:'rgba(0, 0, 0, 0.95)',
        fontSize:14,
        fontWeight:'500',
        marginTop:'5%',
        textAlign:'center',
    },

    InfosE:{
        color:'#fff',
        paddingBottom:10,
        paddingTop:10,
        fontSize:28,
        fontWeight:'600',
        textAlign:'center',
        letterSpacing:5,
        textTransform:'uppercase',
    },
    nomeE:{
        color:'rgba(0, 0, 0, 0.95)',
        fontSize:14,
        fontWeight:'500',
        marginTop:'10%',
        marginLeft:10,
        textAlign:'left',
    },

    Nomeempresa:{
        color:'#fff',
        paddingBottom:10,
        paddingTop:10,
        fontSize:28,
        fontWeight:'600',
        textAlign:'center',
        letterSpacing:5,
        textTransform:'uppercase',
    },
    welcomeText: {
        marginTop:-0,
        fontSize: 24,
        fontWeight: '600',
        color:'#ffff',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 3 },
        textShadowRadius: 7,
    },
    usernameText: {
        fontSize: 24,
        fontWeight: '600',
      
        color:'#ffff',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 3},
        textShadowRadius: 7,
        
    },
    modalContainer: {
        width: "100%",
        opacity: 1,
        top: '86%',
        alignSelf: "center",
      },
      modalContent:{
          height:'25%',
          width:'95%',
          borderRadius:5,
          marginLeft:10,
      },
      modalMessage: {
          fontSize: 14,
          fontWeight: "500",
          textAlign: "center",
          justifyContent:'center',
          paddingTop:14,
          color: "white",
          
          
      },
    
});
