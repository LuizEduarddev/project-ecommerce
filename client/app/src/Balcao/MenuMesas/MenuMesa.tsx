import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';

type Mesa = {
    idMesa: string,
    numeroMesa: number,
    emUso: boolean,
    mesaSuja: boolean
}

const MenuMesa = () => {
    
    const [mesas, setMesas] = useState<Mesa[] | null>(null);
    
    useEffect(() => {
        async function initialization() {
            api.post('api/mesa/get-all')
            .then(response => {
                setMesas(response.data);
                console.log(mesas);
                console.log(response);
            })
            .catch(error => {
                Alert.alert(error as string);
            })
        }

        initialization();
    }, []);

    const renderMesa = ({ item }: { item: Mesa }) => (
        <View>
            <TouchableOpacity>
                <Image 
                    style={{width: 50, height: 50}}
                    source={require('./assets/mesaIcon.png')}
                />
                <Text>{item.numeroMesa}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView>
            {mesas ? (
                <FlatList
                    data={mesas}
                    renderItem={renderMesa}
                    keyExtractor={(item) => item.idMesa}
                />
            ) : (
                <Text>Nenhuma mesa disponível</Text>
            )}
        </SafeAreaView>
    );
}

export default MenuMesa;

const styles = StyleSheet.create({});
