import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({navigation})
{
    return(
        <SafeAreaView>
            <View>
                <Text>Hello, from home!</Text>
            </View>
        </SafeAreaView>
    );
}