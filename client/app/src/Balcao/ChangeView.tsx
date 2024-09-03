import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import MenuBalcao from './MenuBalcao/MenuBalcao';
import MenuMesa from './MenuMesas/MenuMesa';
import MenuUsuario from './MenuUsuario/MenuUsuario';
import MenuProdutos from './MenuProdutos/MenuProdutos';
import api from '../../ApiConfigs/ApiRoute';

const ChangeView = ({ navigation }) => {
    const [view, setView] = useState('mesas');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initialization() {
            const token = await localStorage.getItem('session-token'); 
            if (token == null) {
                navigation.navigate('Login');
            } else {
                try {
                    const response = await api.post('api/auth/get-authorities', null, {
                        params: {
                            token: token,
                        },
                    });
                    const authorities:string[] = response.data;
                    if (!authorities.filter((item) => item === 'ROLE_BALCAO' )) {
                        navigation.navigate('Login');
                    } else {
                        setLoading(false);
                    }
                } catch (error) {
                    console.log('Error during authorization check:', error);
                    navigation.navigate('Login'); 
                }
            }
        }

        initialization();
    }, [navigation]); // Depend on navigation to trigger useEffect when the component mounts

    const renderMenu = () => {
        return (
            <View>
                <Button title="Mesas" onPress={() => setView('mesas')} />
                <Button title="Balcão" onPress={() => setView('balcao')} />
                <Button title="Menu Usuários" onPress={() => setView('menu-usuario')} />
                <Button title="Produtos" onPress={() => setView('menu-produtos')} />
                {view === 'mesas' ? (
                    <MenuMesa />
                ) : view === 'balcao' ? (
                    <MenuBalcao />
                ) : view === 'menu-usuario' ? (
                    <MenuUsuario />
                ) : view === 'menu-produtos' ? (
                    <MenuProdutos />
                ) : (
                    <Text>Nada para mostrar no momento.</Text>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando...</Text>
            </View>
        );
    }

    return <View>{renderMenu()}</View>;
};

export default ChangeView;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
