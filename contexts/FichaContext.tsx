import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import myTheme from "@/theme/theme";
import { Exercicio, useExercicios } from "./ExercicioContext";

export interface Ficha {
  id: string;
  nome: string;
  imagem: any;
  exerciciosIds: string[];
}

interface FichaContext {
  fichas: Ficha[];
  encontrarFichaPorID: (id: string | string[]) => Ficha | undefined;
  adicionarFicha: (novaFicha: Ficha) => void;
  editarFicha: (FichaEditada: Ficha) => void;
  excluirFicha: (id: string) => void;

  getExercicios: (idsExercicio: string[]) => Exercicio[];
}

export const FichaContext = createContext<FichaContext | null>(null);

interface FichaProviderProps {
  children: ReactNode;
}

export function FichaProvider({children}: FichaProviderProps) {
  const { getItem, setItem } = useAsyncStorage("@fichas");
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const { encontrarExercicioPorID } = useExercicios();

  useEffect(() => {
    async function lerDados() {
      try {
        const item = await getItem();
        setFichas(item !== null ? JSON.parse(item) : []);
      } catch(e) {
        console.error("Erro ao carregar exercícios do AsyncStorage", e);
        setFichas([]);
      } finally {
        setLoading(false);
      }
    }

    lerDados();
  }, []);

  useEffect(() => {
    if (!loading) { 
      setItem(JSON.stringify(fichas));
    }
  }, [fichas]);

  function encontrarFichaPorID (id: string | string[]) {
    const idBusca = Array.isArray(id) ? id[0] : id;

    return fichas.find((item) => item.id === idBusca);
  }

  function adicionarFicha (novaFicha: Ficha) {
    setFichas(estadoAtual => {
      const novoVetor = [novaFicha, ...estadoAtual];

      return novoVetor;
    });
  }

  function editarFicha (FichaEditada: Ficha) {
    setFichas(estadoAtual => {
      const novoVetor = estadoAtual.map((item) => item.id === FichaEditada.id ? FichaEditada: item);

      return novoVetor;
    });
  }

  function excluirFicha (id: string) {
    setFichas(estadoAtual => {
      const novoVetor = estadoAtual.filter(item => item.id !== id);

      return novoVetor;
    });
  }

  function getExercicios(idsExercicio: string[]) {
    return idsExercicio
      .map((id) => encontrarExercicioPorID(id))
      .filter((ex): ex is Exercicio => ex !== undefined);
  }

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: myTheme.colors.background }}>
        <ActivityIndicator size="large" color={myTheme.colors.primary} />
      </View>
    );
  }

  return (
    <FichaContext.Provider value={{ fichas, encontrarFichaPorID, adicionarFicha, editarFicha, excluirFicha, getExercicios}}>
      {children}
    </FichaContext.Provider>
  );
}

export function useFichas() {
  const context = useContext(FichaContext);

  if (!context) {
    throw new Error("useFichas deve ser usado dentro de um FichaProvider");
  }

  return context;
}