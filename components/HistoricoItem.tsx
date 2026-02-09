import { RegistroHistorico, Serie } from "@/contexts/ExercicioContext";
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

const HistoricoItem = ({ item }: { item: RegistroHistorico }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <View style={styles.cardHistorico}>
      <TouchableRipple
        onPress={() => setExpandido(!expandido)}
        style={{ borderRadius: 15 }}
        borderless
      >
        <View style={styles.headerHistorico}>
          <View>
            <Text variant="titleMedium" style={{ color: myTheme.colors.onSurface }}>
              {item.data}
            </Text>
          </View>
          
          <Lucide
            name={expandido ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={myTheme.colors.primary} 
          />
        </View>
      </TouchableRipple>

      {expandido && (
        <View style={styles.conteudoHistorico}>
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

export default HistoricoItem;

const styles = StyleSheet.create({
  cardHistorico: {
    backgroundColor: myTheme.colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: myTheme.colors.outlineVariant,
    marginBottom: 12,
    overflow: "hidden",
  },
  headerHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  conteudoHistorico: {
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
  }
});