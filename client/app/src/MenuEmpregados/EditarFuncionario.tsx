import { View, Text, TextInput, ScrollView, Pressable, SafeAreaView , StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../assets/colors';

type EmpregadosDTO = {
  id: string;
  authorities: string;
  nome: string;
  telefone: string;
  cpf: string;
  endereco: string;
  email: string;
};

const EditarFuncionario = ({ id }: { id: string }) => {
  const toast = useToast();

  const [funcionario, setFuncionario] = useState<EmpregadosDTO>();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [authoritiesDisponiveis, setAuthoritiesDisponiveis] = useState([]);
  const [authoritie, setAuthoritie] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();

    api.get('api/auth/get-roles', {
      params:{
        token:token
      }
    })
    .then(response => {
      setAuthoritiesDisponiveis(response.data);
    })
    .catch(error => {
      toast.show('Falha ao buscar as autoridades', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();

    const dto = {
      idFuncionario: id,
      token: token,
    };
    
    api.post('api/auth/empresa/get-by-id', dto)
    .then(response => {
      const data = response.data;
      const newAuthoritie = data.authorities
      setFuncionario(data);
      setNome(data.nome);
      setTelefone(data.telefone);
      setCpf(data.cpf);
      setEndereco(data.endereco);
      setEmail(data.email);
      setAuthoritie(newAuthoritie);
      console.log(authoritie);
    })
    .catch(error => {
      toast.show('Funcionário não encontrado', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    });
  }, []);

  const validateForm = () => {
    if (!nome || !telefone || !cpf || !endereco || !email || !authoritie)
    {
      toast.show('Preencha todos os campos', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
    else{
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();

    const dto = {
      idFuncionario: id,
      nomeCompleto: nome,
      telefone,
      cpf,
      endereco,
      email,
      autoritie: authoritie,
      token
    }

    api.post('api/auth/funcionario/alter-profile', dto)
    .then(response => {
      toast.show('Funcionário alterado com sucesso', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    })
    .catch(error => {
      toast.show('Falha ao tentar alterar os dados do funcionário', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    })
  };

  const renderAutoridades = () => {
    if (authoritiesDisponiveis && authoritiesDisponiveis.length > 0) {
      const dropdownData = authoritiesDisponiveis.map(autoritie => ({
          label: autoritie, 
          value: autoritie  
      }));

      return (
          <View>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                inputSearchStyle={styles.inputSearch}
                iconStyle={styles.icon}
                data={dropdownData} 
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Escolha uma autoridade"
                value={authoritie}
                onChange={(item) => {
                    setAuthoritie(item.value);
                }}
              />
          </View>
      );
  } else {
      return (
          <Text>As categorias não foram carregadas corretamente, tente novamente mais tarde.</Text>
      );
  }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Visualizar Funcionário</Text>
        </View>

        <View style={styles.detailsSection}>
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            style={styles.input}
          />
          <TextInput
            placeholder="CPF"
            value={cpf}
            onChangeText={setCpf}
            style={styles.input}
          />
          <TextInput
            placeholder="Endereço"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          {renderAutoridades()}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.submitButton} onPress={() => validateForm()}>
            <Text style={styles.submitButtonText}>Salvar Alterações</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditarFuncionario;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsSection: {
    flex: 2,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdown: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.cinza,
    borderRadius: 5,
  },
  placeholder: {
    color: '#333',
    fontSize: 16,
  },
  selectedText: {
    color: '#333',
    fontSize: 16,
  },
  inputSearch: {
    color: '#333',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
})
