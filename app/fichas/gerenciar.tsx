import FichaExercicioItem from "@/components/FichaExercicioItem";
import { ListaExercicios } from "@/components/telas/ListaExercicios";
import { Exercicio, useExercicios } from "@/contexts/ExercicioContext";
import { Ficha, useFichas } from "@/contexts/FichaContext";
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View, Modal, TouchableWithoutFeedback, Keyboard } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Modal as ModalPaper,
  Portal,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import ReorderableList, { ReorderableListReorderEvent } from "react-native-reorderable-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GerenciarFicha() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const {
    getExercicios,
    editarFicha,
    adicionarFicha,
    excluirFicha,
    encontrarFichaPorID,
  } = useFichas();

  const {exercicios: exerciciosGlobal} = useExercicios();

  const modoEdicao = id !== "novo";

  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [modalVisivel, setModalVisivel] = useState(false);

  const handleEditarAdicionar = () => {
    const novaFicha: Ficha = {
      id: modoEdicao ? ficha!.id : new Date().getTime().toString(),
      nome: nome,
      imagem: imagem ? imagem : modoEdicao ? ficha!.imagem : null,
      exerciciosIds: exercicios.map((exercicio) => exercicio.id),
    };

    if (modoEdicao) {
      editarFicha(novaFicha);
    } else {
      adicionarFicha(novaFicha);
    }

    router.back();
  };

  useEffect(() => {
    if (modoEdicao) {
      const fichaEncontrada = encontrarFichaPorID(id);

      if (fichaEncontrada) {
        setFicha(fichaEncontrada);
        setNome(fichaEncontrada.nome);
        setExercicios(getExercicios(fichaEncontrada.exerciciosIds));
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [id, modoEdicao]);

  useEffect(() => {
    if(ficha && !modalVisivel){
      setExercicios(getExercicios(ficha.exerciciosIds));
    }
  }, [exerciciosGlobal]);

  const escolherImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissao.granted === false) {
      alert("Precisamos de permissão para acessar sua galeria!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const handleApagarExercicio = useCallback((id: string) => {
    setExercicios((prev) => prev.filter((ex) => ex.id !== id));
  }, []);

  const handleReorder = useCallback(({ from, to }: ReorderableListReorderEvent) => {
    setExercicios((prev) => {
      const novoVetor = [...prev];
      const [itemRemovido] = novoVetor.splice(from, 1);
      novoVetor.splice(to, 0, itemRemovido);
      return novoVetor;
    });
  }, []);

  const renderFooter = () => (
    <View style={{ marginTop: 18 }}>
      <Button
        mode="outlined"
        onPress={() => setModalVisivel(true)}
        style={{
          outlineColor: myTheme.colors.onSurfaceVariant,
          outlineWidth: 1,
          borderRadius: 10,
        }}
      >
        <Lucide name="plus" size={24} color={myTheme.colors.primary} />
      </Button>
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: insets.bottom + 16, paddingHorizontal: 0 },
        ]}
      >
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
          buttonColor={myTheme.colors.secondary}
          textColor={myTheme.colors.onSurface}
        >
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleEditarAdicionar}
          textColor={myTheme.colors.onSurface}
          style={styles.button}
          disabled={nome.trim() === "" || exercicios.length === 0}
        >
          {modoEdicao ? "Salvar" : "Adicionar"}
        </Button>
      </View>

      <Portal>
        <ModalPaper
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalBox}
        >
          <Text variant="headlineSmall" style={{ textAlign: "center" }}>
            Tem certeza que deseja excluir essa ficha?
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button
              onPress={hideModal}
              style={{ flex: 1 }}
              mode="contained"
              buttonColor={myTheme.colors.secondary}
              textColor={myTheme.colors.onSurface}
            >
              Cancelar
            </Button>
            <Button
              onPress={() => {
                excluirFicha(ficha!.id);
                hideModal();
                router.back();
              }}
              style={{ flex: 1 }}
              mode="contained"
              buttonColor={myTheme.colors.error}
              textColor={myTheme.colors.onSurface}
            >
              Deletar
            </Button>
          </View>
        </ModalPaper>
      </Portal>
    </View>
  );

  if (modoEdicao && !ficha) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: myTheme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={myTheme.colors.primary} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: myTheme.colors.background,
          position: "relative",
        }}
      >
        <Appbar.Header style={{ backgroundColor: myTheme.colors.background }}>
          <Appbar.Action icon="arrow-left" onPress={() => router.back()} />
          <Appbar.Content title={modoEdicao ? "Editar Ficha" : "Criar Ficha"} />
          {modoEdicao && (
            <Appbar.Action
              icon={() => (
                <Lucide name="trash-2" size={24} color={myTheme.colors.error} />
              )}
              onPress={showModal}
            />
          )}
        </Appbar.Header>

        <View style={{ paddingHorizontal: 20, gap: 18, marginBottom: 18 }}>
          <TextInput
            mode="outlined"
            label="Nome"
            placeholder={modoEdicao ? ficha?.nome : ""}
            value={nome}
            onChangeText={setNome}
            style={{ backgroundColor: myTheme.colors.background }}
            outlineStyle={{ borderRadius: 15, borderWidth: 2 }}
          />
          <TouchableRipple
            borderless
            onPress={escolherImagem}
            style={[{ borderRadius: 18 }]}
          >
            <View style={styles.imagePickerBox}>
              {imagem ? (
                <Image source={{ uri: imagem }} style={styles.imagem} />
              ) : ficha?.imagem ? (
                <Image
                  source={
                    typeof ficha.imagem === "string"
                      ? { uri: ficha.imagem }
                      : require("@/assets/exercicio.jpg")
                  }
                  style={styles.imagem}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Lucide
                    name="camera"
                    size={32}
                    color={myTheme.colors.onSurfaceVariant}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ color: myTheme.colors.onSurfaceVariant }}
                  >
                    Selecione uma imagem
                  </Text>
                </View>
              )}
            </View>
          </TouchableRipple>
          <Text variant="headlineLarge" style={{ marginBottom: -10 }}>
            Exercícios
          </Text>
        </View>

        <ReorderableList
          data={exercicios}
          onReorder={handleReorder}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{
            paddingHorizontal: 20,
            overflow: "visible",
            flexGrow: 1,
          }}
          ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
          renderItem={({ item }) => (
            <FichaExercicioItem
              item={item}
              isActive={false}
              apagarExercicio={() => handleApagarExercicio(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />

        <Modal 
          visible={modalVisivel} 
          animationType="slide" 
          onRequestClose={() => setModalVisivel(false)}
          presentationStyle="fullScreen"
          statusBarTranslucent={true}
        >
          <ListaExercicios
            onClose={() => setModalVisivel(false)}
            onSelect={(e) => {
              setExercicios(prev => ([...prev, e]));
              ficha?.exerciciosIds.push(e.id);
              setModalVisivel(false);
            }}
          />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 2,
    flex: 1,
  },
  imagem: {
    width: "100%",
    height: 120,
    minHeight: 85,
    overflow: "hidden",
  },
  FAB: {
    position: "absolute",
    right: 20,
    borderRadius: "50%",
    backgroundColor: myTheme.colors.primary,
    zIndex: 1,
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerBox: {
    width: "100%",
    height: 120,
    backgroundColor: myTheme.colors.surface,
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
