import { Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native"
import React, { useMemo, useState } from "react"
import { AnimatedFAB, Appbar, Searchbar, Text, TouchableRipple } from "react-native-paper"
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import { FlatList } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Exercicio, useExercicios } from "@/contexts/ExercicioContext";

export const ListaExercicios = ({ onSelect, onClose }: { onSelect: (e: Exercicio) => void, onClose: () => void }) => {
  const [isExtended, setIsExtended] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const {exercicios} = useExercicios();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(event.nativeEvent.contentOffset.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if(query === "") {
      return exercicios;
    }

    return exercicios.filter((exercicio) => {
      const nomeExercicio = exercicio.nome.toLowerCase();

      return nomeExercicio.includes(query);
    })
  }, [searchQuery, exercicios]);

  return (
    <View style={{
      flex:1,
      backgroundColor: myTheme.colors.background
    }}>
      <Appbar.Header
        style={{ backgroundColor: myTheme.colors.background }}
      >
        <Appbar.Action icon="arrow-left" onPress={onClose} />
        <Appbar.Content title={"Selecionar Exercício"}></Appbar.Content>
      </Appbar.Header>
      <View style={styles.container}>
        <Searchbar
          placeholder="Pesquisar"
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={({ color, size }) => (
            <Lucide name="search" color={color} size={size} />
          )}
          style={styles.searchbar}
          inputStyle={{ color: myTheme.colors.onSurface }}
        />

        {filteredData.length === 0
        ? <View style={{flex: 1, marginTop:40, gap:10, alignItems: "center"}}>
            <Text variant="headlineSmall" style={{textAlign: "center"}}>Nenhum Exercício Encontrado</Text>
          </View>
        :  <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableRipple borderless style={styles.exercicio} onPress={() => onSelect(item)}>
                <View style={styles.exercicioContent}>
                  <Image source={typeof item.imagem === "string" ? {uri: item.imagem} : require("../../assets/exercicio.jpg")} style={styles.imagem} />
                  <View style={{ width: "70%", marginVertical: 4, gap: 3 }}>
                    <Text variant="labelLarge" style={{ flex: 1, fontSize: 18 }}>
                      {item.nome}
                    </Text>
                  </View>
                </View>
              </TouchableRipple>
            )}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            onScroll={onScroll}
          />
        }
      </View>

      <AnimatedFAB
        color="white"
        icon={({ color, size }) => (
          <Lucide name="plus" color={color} size={size} />
        )}
        label={"Novo Exercício"}
        extended={isExtended}
        onPress={() => router.push("/exercicios/gerenciar?id=novo")}
        visible={true}
        iconMode={"dynamic"}
        style={[styles.fabStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: myTheme.colors.background,
    width: "100%",
  },
  fabStyle: {
    bottom: 16,
    position: "absolute",
    right: 16,
    backgroundColor: myTheme.colors.primary,
  },
  searchbar: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: myTheme.colors.surface,
  },
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