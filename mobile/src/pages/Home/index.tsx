import React, { useState, useEffect } from 'react'
import {
  View, Text,
  StyleSheet, Image,
  ImageBackground, TextInput,
  KeyboardAvoidingView, Platform
} from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import DropDown from 'react-native-picker-select'
import axios from 'axios';

interface IBGEUfResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  const navigation = useNavigation();
  const [uf, setUf] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const handleNavigationToPoint = () => {
    navigation.navigate('Points', {
      uf: selectedUf, 
      city: selectedCity
    })
  }

  const handleSelectUf = (value: any) => {
    setSelectedUf(value)
  };

  const handleSelectCity = (value: any) => {
    setSelectedCity(value)
  };

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(res => {
        const ufInitials = res.data.map(uf => uf.sigla);
        setUf(ufInitials);
      })
  }, [])

  //Carregar as cidades sempre que a UF mudar.
  useEffect(() => {
    if (selectedUf === "0") return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const cityName = res.data.map(city => city.nome);
        setCity(cityName);
      })
  }, [selectedUf])


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        style={styles.container}
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}>
        <View style={styles.main} >
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>


        <View style={styles.footer}>
          <DropDown
            placeholder={({ label: 'Selecione um UF' })}
            onValueChange={(value) => handleSelectUf(value)}
            items={uf.map(uf => ({ label: uf, value: uf }))}
          />
          <DropDown
            placeholder={({ label: 'Selecione uma Cidade' })}
            onValueChange={(value) => handleSelectCity(value)}
            items={city.map(city => ({ label: city, value: city }))}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoint}>
            <View style={styles.buttonIcon}>
              <Text><Icon name="arrow-right" color="#FFF" size={24} /></Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;