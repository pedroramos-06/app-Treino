import { View, StyleSheet, Image, FlatList } from "react-native";
import myTheme from "@/theme/theme";
import {
  FAB,
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

export default function GerenciarExercicio() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { encontrarExercicioPorID, editarExercicio, adicionarExercicio, excluirExercicio } = useExercicios();

  const modoEdicao = id !== "novo";

  const [ exercicio, setExercicio ] = useState<Exercicio | null>(null);

  const [ nome, setNome ] = useState("");
  const [ imagem, setImagem ] = useState<string | null>(null);
  const [series, setSeries] = useState<Serie[]>([]);
  
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleEditarAdicionar = () => {
    const novoExercicio: Exercicio = {
      id: modoEdicao ? exercicio!.id : new Date().getTime().toString(),
      nome: nome,
      imagem: imagem ? imagem : modoEdicao ? exercicio!.imagem : null,
      series: series,
      historico: modoEdicao ? exercicio!.historico : []
    }

    if(modoEdicao){
      editarExercicio(novoExercicio);
    } else {
      adicionarExercicio(novoExercicio);
    }

    router.back();
  }

  useEffect(() => {
    if(modoEdicao) {
      const exercicioEncontrado = encontrarExercicioPorID(id);

      if(exercicioEncontrado) {
        setExercicio(exercicioEncontrado);

        setNome(exercicioEncontrado.nome);
        setSeries(exercicioEncontrado.series);
      } else {
        router.replace("/(tabs)/exercicios");
      }
    }
  }, [id, modoEdicao]);

  const escolherImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(permissao.granted === false){
      alert("Precisamos de permissão para acessar sua galeria!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true, 
      aspect: [4, 3],      
      quality: 1,          
    });

    if(!resultado.canceled){
      setImagem(resultado.assets[0].uri)
    }
  }

  if(modoEdicao && !exercicio){
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: myTheme.colors.background }}>
        <ActivityIndicator size="large" color={myTheme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: myTheme.colors.background,
        position: "relative",
      }}
    >
      <Appbar.Header
        style={{ backgroundColor: myTheme.colors.background }}
      >
        <Appbar.Action icon="arrow-left" onPress={() => router.back()} />
        <Appbar.Content title={modoEdicao ? "Editar Exercício": "Adicionar Exercício"}></Appbar.Content>
        {modoEdicao && <Appbar.Action icon={() => (<Lucide name="trash-2" size={24} color={myTheme.colors.error}> </Lucide>)} onPress={showModal} />}
      </Appbar.Header>

      <View style={styles.headerContainer}>
      <TextInput
        mode="outlined"
        label="Nome"
        placeholder={modoEdicao ? exercicio?.nome : ""}
        value={nome}
        onChangeText={nome => setNome(nome)}
        style={{ backgroundColor: myTheme.colors.surface }}
        outlineStyle={{borderRadius:15, borderWidth:2}}
      />
      <TouchableRipple
        borderless
        onPress={escolherImagem}
        style={[{ borderRadius: 18 }]}
        // rippleColor={myTheme.colors.primaryContainer}
      >
        <View style={styles.imagePickerBox}>
          { imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagem} />
          )
          : exercicio?.imagem ? (
            <Image source={typeof exercicio.imagem === "string" ? {uri: exercicio.imagem} : require("../assets/exercicio.jpg")} style={styles.imagem} />
          )
          : (
            <View style={styles.placeholderContainer}>
              <Lucide name="camera" size={32} color={myTheme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: myTheme.colors.onSurfaceVariant }}>
                Selecione uma imagem
              </Text>
            </View>
          )}
        </View>
      </TouchableRipple>

      <Button
        mode="contained"
        onPress={() => {}}
        buttonColor={myTheme.colors.surface}
        textColor={myTheme.colors.onSurface}
        style={{ borderRadius: 16 }}
        contentStyle={{ 
          height: 56, 
          justifyContent: "flex-start", 
          paddingHorizontal: 8
        }}
        icon= {() => <Lucide name="clock" size={24} color={myTheme.colors.tertiary} />}
      >
        Visualizar Historico de Carga
      </Button>
    </View>

      <FlatList
        data={series}
        keyExtractor={(item) => item.index}
        renderItem={({ item }) => <ProducaoItem item={item} modoSecundario={true} onPress={() => abrirModalEditar(item)} onDelete={() => {
          setIdProdExcluir(item.id)
          setModalExcluir(true);
        }}/>}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        contentContainerStyle={{paddingHorizontal: 20, flexGrow: 1, gap:16}}
        ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
      />

      <View style={[styles.footerContainer, {paddingBottom: insets.bottom+16}]}>
      <Button 
        mode="contained" 
        onPress={() => router.back()} 
        style={styles.button}
        buttonColor= {myTheme.colors.surface}
      >
        Cancelar
      </Button>
      <Button 
        mode="contained" 
        onPress={handleEditarAdicionar} 
        style={styles.button}
        disabled={nome.trim() === "" || series.length === 0}
      >
        {modoEdicao ? "Salvar" : "Adicionar"}
      </Button>
      
    </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalBox}
        >
          <Text
            variant="headlineSmall"
            style={{ marginLeft: 8, textAlign: "center" }}
          >
            Tem certeza que deseja excluir esse exercício?
          </Text>

          <View style={styles.modalButtonContainer}>
            <Button
              onPress={hideModal}
              style={{ flex: 1 }}
              mode="contained"
              buttonColor={myTheme.colors.surface}
            >
              Cancelar
            </Button>
            <Button
              onPress={() => {
                excluirExercicio(exercicio!.id);
                hideModal();
                router.back();
              }}
              style={{ flex: 1 }}
              mode="contained"
              buttonColor={myTheme.colors.error}
            >
              Deletar
            </Button>
          </View>
        </Modal>
      </Portal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    gap: 16,
    width: "100%",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 16,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 2,
    flex: 1,
  },
  input: {
    backgroundColor: myTheme.colors.surface,
  },
  inputUnderline: {
    height: 0,
  },
  inputView: {
    backgroundColor: myTheme.colors.surface,
    borderRadius: 16,
    overflow: "hidden",
  },
  dados: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 16,
    backgroundColor: myTheme.colors.surface,
    flex: 1,
  },
  dado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    width: "50%",
    justifyContent: "center",
  },
  imagem: {
    width: "100%",
    height: 120,
    minHeight: 85,
    overflow: "hidden",
  },
  imagemOverlay: {
    width: "100%",
    height: 120,
    minHeight: 85,
    overflow: "hidden",
    opacity: 0.25,
    backgroundColor: "#000000ff",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
  },
  imagemText: {
    position: "absolute",
    zIndex: 2,
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
  },
  imagemContainer: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", 
    borderRadius: 18,
  },
  FAB: {
    position: "absolute",
    right: 20,
    borderRadius: "50%",
    backgroundColor: myTheme.colors.primary,
    zIndex: 1,
  },
  horta: {
    borderRadius: 18,
    width: "100%",

    marginBottom: 16,
    paddingRight: 20,
    padding: 10,
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerBox: {
    width: "100%",
    height: 120,
    backgroundColor: "#d9d9d9",
    borderRadius: 18,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: myTheme.colors.onSurfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", 
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: myTheme.colors.background,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 18,
  },
});
