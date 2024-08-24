import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';

type Mesa = {
    idMesa: string,
    numeroMesa: number,
    emUso: boolean,
    mesaSuja: boolean
}

const MenuMesa = () => {
    const [mesas, setMesas] = useState<Mesa[]>([]);

    useEffect(() => {
        const fetchMesas = async () => {
            api.post('api/mesa/get-all', "", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  }
            })
            .then(response => {
                console.log(response.data);
                setMesas(response.data);
            })
            .catch(error => {
                console.log(error as string);
            })
        };

        fetchMesas();
    }, []);

    const renderMesa = useCallback(({ item }: { item: Mesa }) => (
        <View style={styles.mesaContainer}>
            <TouchableOpacity>
                <Image 
                    style={styles.mesaIcon}
                    source={require('./assets/mesaIcon.png')}
                />
                <Text style={styles.mesaText}>{item.numeroMesa}</Text>
            </TouchableOpacity>
        </View>
    ), []);

    return (
        <SafeAreaView style={styles.container}>
            {mesas.length > 0 ? (
                <FlatList
                    data={mesas}
                    horizontal
                    renderItem={renderMesa}
                    keyExtractor={(item) => item.idMesa}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                />
            ) : (
                <Text style={styles.noMesaText}>Nenhuma mesa disponível</Text>
            )}
        </SafeAreaView>
    );
}

export default MenuMesa;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    mesaContainer: {
        padding: 5,
        alignItems: 'center',
    },
    mesaIcon: {
        width: 50,
        height: 50,
    },
    mesaText: {
        marginTop: 5,
        textAlign: 'center',
    },
    noMesaText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});
