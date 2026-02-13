import { Exercicio, Serie } from "@/contexts/ExercicioContext";
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouter } from "expo-router";
import { useState, memo } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { useReorderableDrag } from "react-native-reorderable-list";

const FichaExercicioItem = ({ item, apagarExercicio, isActive }: { item: Exercicio, apagarExercicio: () => void, isActive: boolean }) => {
  const [expandido, setExpandido] = useState(false);
  const router = useRouter();

  const drag = useReorderableDrag();

  return (
    <View style={styles.card}>
      <TouchableRipple
        onPress={() => setExpandido(!expandido)}
        onLongPress={drag}
        style={{ borderRadius: 15 }}
        borderless
      >
        <View style={styles.header}>
          <View style={{flexDirection: "row", gap: 15, alignItems:"center", width:"45%"}}>
            <Image source={typeof item.imagem === "string" ? {uri: item.imagem} : require("../assets/exercicio.jpg")} style={styles.imagem} />
            <Text variant="titleMedium" style={{ color: myTheme.colors.onSurface }}>
              {item.nome}
            </Text>
          </View>
          
          <View style={{flexDirection:"row", gap:0, marginRight:-15}}>
            <TouchableRipple
              onPress={() => router.push(`/exercicios/gerenciar?id=${item.id}`)}
              disabled={isActive}
              borderless
              style={{ borderRadius: 20 }}
            >
              <View style={{ 
                width: 40, 
                height: 40, 
                justifyContent: "center", 
                alignItems: "center" 
              }}>
                <Lucide name="square-pen" size={24} color={myTheme.colors.tertiary} />
              </View>
            </TouchableRipple>
            
            <TouchableRipple
              onPress={apagarExercicio}
              disabled={isActive}
              borderless
              style={{ borderRadius: 20 }}
            >
              <View style={{
                width: 40, 
                height: 40, 
                justifyContent: "center", 
                alignItems: "center" 
              }}>
                <Lucide name="circle-x" size={24} color={myTheme.colors.error} />
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => {}}
              onLongPress={drag}
              disabled={isActive}
              borderless
              style={{ borderRadius: 20 }}
            >
              <View style={{ 
                width: 40, 
                height: 40, 
                justifyContent: "center", 
                alignItems: "center"
              }}>
                <Lucide name="menu" size={24} color={myTheme.colors.secondary} />
              </View>
            </TouchableRipple>
          
          </View>
        </View>
      </TouchableRipple>

      {expandido && (
        <View style={styles.conteudo}>
          <View style={styles.divisor} />
          {item.series.map((serie: Serie, index: number) => (
            <View key={index} >
              <View style={styles.linhaSerie}>
                <Text variant="bodyMedium">Reps</Text>
                <View style={styles.serieItem} >
                  <Text variant="bodyMedium">{serie.repeticoes}</Text>
                </View>
                <Text variant="bodyMedium">Carga(Kg)</Text>
                <View style={styles.serieItem} >
                  <Text variant="bodyMedium">{serie.carga}</Text>
                </View>
              </View>
              {(index < item.series.length-1) && <View style={styles.divisor} />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default memo(FichaExercicioItem);

const styles = StyleSheet.create({
  card: {
    backgroundColor: myTheme.colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: myTheme.colors.outlineVariant,
    marginBottom: 12,
    overflow: "visible",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  conteudo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divisor: {
    height: 1,
    backgroundColor: myTheme.colors.outlineVariant,
    marginBottom: 12,
  },
  linhaSerie: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems:"baseline",
    marginBottom: 8,
    gap:8
  },
  serieItem: {
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: myTheme.colors.background, 
    height: 35, 
    width:50, 
    borderRadius:15, 
    borderWidth:2, 
    borderColor: myTheme.colors.secondary
  },
  imagem: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
});