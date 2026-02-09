import { View, StyleSheet, Image, ScrollView, FlatList } from "react-native";
import myTheme from "@/theme/theme";
import {
  Appbar,
  TextInput,
  Text,
  TouchableRipple,
  Button,
  ActivityIndicator,
  Modal,
  Portal
} from "react-native-paper";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react";
import { Exercicio, Serie, useExercicios } from "@/contexts/ExercicioContext";
import HistoricoItem from "@/components/HistoricoItem";

export default function HistoricoExercicio() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { encontrarExercicioPorID } = useExercicios();

  const [exercicio, setExercicio] = useState<Exercicio>();

  useEffect(() => {
    const exercicioEncontrado = encontrarExercicioPorID(id);

    if (exercicioEncontrado) {
      setExercicio(exercicioEncontrado);
    } else {
      router.back();
    }
  }, [id]);

  return (
    <View style={{flex:1, backgroundColor:myTheme.colors.background}}>
      <Appbar.Header
        style={{ backgroundColor: myTheme.colors.background }}
      >
        <Appbar.Action icon="arrow-left" onPress={() => router.back()} />
        <Appbar.Content title={"Histórico de Carga"}></Appbar.Content>
      </Appbar.Header>

      <View style={styles.container}>

        <FlatList
          data={exercicio?.historico}
          keyExtractor={(item) => item.data}
          renderItem={({ item }) => <HistoricoItem item={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: myTheme.colors.background,
    paddingHorizontal:20,
  }
});