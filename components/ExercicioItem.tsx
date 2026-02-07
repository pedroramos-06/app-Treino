import myTheme from "@/theme/theme";
import { View, Image, StyleSheet } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { Exercicio } from "@/contexts/ExercicioContext";

function ExercicioItem({item}: {item: Exercicio}) {
  const router = useRouter();

  return (
    <TouchableRipple borderless style={styles.exercicio} onPress={() => {}}>
      <View style={styles.exercicioContent}>
        <Image source={typeof item.imagem === "string" ? {uri: item.imagem} : require("../assets/exercicio.jpg")} style={styles.imagem} />
        <View style={{ width: "70%", marginVertical: 4, gap: 3 }}>
          <Text variant="labelLarge" style={{ flex: 1, fontSize: 18 }}>
            {item.nome}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
}

export default ExercicioItem;

const styles = StyleSheet.create({
  exercicio: {
    borderRadius: 18,
    width: "100%",
    backgroundColor: myTheme.colors.surface,
    marginBottom: 16,
    paddingRight: 20,
    padding: 10,
  },
  exercicioContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  imagem: {
    width: 95,
    height: 95,
    borderRadius: 14,
  },
});
