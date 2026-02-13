import myTheme from "@/theme/theme";
import { View, Image, StyleSheet } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ficha } from "@/contexts/FichaContext";

function FichaItem({item}: {item: Ficha}) {
  const router = useRouter();

  return (
    <TouchableRipple borderless style={styles.exercicio} onPress={() => router.push(`/fichas/gerenciar?id=${item.id}`)}>
      <View style={styles.exercicioContent}>
        <Image source={typeof item.imagem === "string" ? {uri: item.imagem} : require("../assets/Ficha.jpg")} style={styles.imagem} />
        <View style={{ width: "70%", marginVertical: 4, gap: 3 }}>
          <Text variant="headlineSmall" style={{ flex: 1 }}>
            {item.nome}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
}

export default FichaItem;

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
