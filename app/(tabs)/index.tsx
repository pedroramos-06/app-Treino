import myTheme from "@/theme/theme";
import { useMemo, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from "react-native";
import { View } from "react-native";
import { AnimatedFAB, Searchbar, Text } from "react-native-paper";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouter } from "expo-router";
import { useFichas } from "@/contexts/FichaContext";
import FichaItem from "@/components/FichaItem";

export default function TabOneScreen() {
  const [isExtended, setIsExtended] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const {fichas} = useFichas();
  const router = useRouter();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(event.nativeEvent.contentOffset.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if(query === "") {
      return fichas;
    }

    return fichas.filter((ficha) => {
      const nomeFicha = ficha.nome.toLowerCase();

      return nomeFicha.includes(query);
    })
  }, [searchQuery, fichas]);

  return (
    <View style={{
      flex:1,
      backgroundColor: myTheme.colors.background
    }}>
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
        ? <View style={{flex: 1, marginTop:40, gap:10, alignItems: 'center'}}>
            <Text variant="headlineSmall" style={{textAlign: 'center'}}>Nenhuma Ficha Encontrada</Text>
          </View>
        :  <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FichaItem item={item} />}
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
        label={"Nova Ficha"}
        extended={isExtended}
        onPress={() => router.push("/fichas/gerenciar?id=novo")}
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
});
