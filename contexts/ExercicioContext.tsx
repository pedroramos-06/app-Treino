import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
// import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import myTheme from "@/theme/theme";

export interface Serie {
  repeticoes: number;
  carga: number;
}

export interface RegistroHistorico {
  data: string;
  series: Serie[];
}

export interface Exercicio {
  id: string;
  nome: string;
  imagem: any;
  series: Serie[];
  historico: RegistroHistorico[];
}

const MOCK_EXERCICIOS: Exercicio[] = [
  {
    id: "1",
    nome: "Supino Reto",
    imagem: null,
    series: [
      { repeticoes: 10, carga: 60 },
      { repeticoes: 10, carga: 60 },
      { repeticoes: 8, carga: 65 },
    ],
    historico: [
      {
        data: "2026-02-01",
        series: [{ repeticoes: 10, carga: 50 }],
      },
    ],
  },
  {
    id: "2",
    nome: "Agachamento Livre",
    imagem: null,
    series: [
      { repeticoes: 12, carga: 80 },
      { repeticoes: 12, carga: 80 },
      { repeticoes: 10, carga: 90 },
      { repeticoes: 10, carga: 90 },
    ],
    historico: [
      {
        data: "2026-01-25",
        series: [{ repeticoes: 12, carga: 70 }],
      },
    ],
  },
  {
    id: "3",
    nome: "Puxada Frente (Pulldown)",
    imagem: null,
    series: [
      { repeticoes: 12, carga: 50 },
      { repeticoes: 12, carga: 50 },
      { repeticoes: 12, carga: 50 },
    ],
    historico: [],
  },
  {
    id: "4",
    nome: "Rosca Direta",
    imagem: null,
    series: [
      { repeticoes: 10, carga: 15 },
      { repeticoes: 10, carga: 15 },
      { repeticoes: 10, carga: 15 },
    ],
    historico: [
      {
        data: "2026-02-05",
        series: [{ repeticoes: 10, carga: 12 }],
      },
    ],
  },
  {
    id: "5",
    nome: "Leg Press 45º",
    imagem: null,
    series: [
      { repeticoes: 12, carga: 160 },
      { repeticoes: 12, carga: 160 },
      { repeticoes: 10, carga: 180 },
    ],
    historico: [
      {
        data: "2026-01-20",
        series: [{ repeticoes: 12, carga: 140 }],
      },
    ],
  },
  {
    id: "6",
    nome: "Elevação Lateral",
    imagem: null,
    series: [
      { repeticoes: 15, carga: 10 },
      { repeticoes: 15, carga: 10 },
      { repeticoes: 12, carga: 12 },
    ],
    historico: [],
  },
  {
    id: "7",
    nome: "Tríceps Corda",
    imagem: null,
    series: [
      { repeticoes: 12, carga: 25 },
      { repeticoes: 12, carga: 25 },
      { repeticoes: 12, carga: 25 },
    ],
    historico: [
      {
        data: "2026-02-02",
        series: [{ repeticoes: 12, carga: 20 }],
      },
    ],
  },
  {
    id: "8",
    nome: "Levantamento Terra",
    imagem: null,
    series: [
      { repeticoes: 5, carga: 100 },
      { repeticoes: 5, carga: 100 },
      { repeticoes: 5, carga: 100 },
    ],
    historico: [
      {
        data: "2026-01-15",
        series: [{ repeticoes: 5, carga: 90 }],
      },
    ],
  },
];

interface ExercicioContext {
  exercicios: Exercicio[];
  encontrarExercicioPorID: (id: string | string[]) => Exercicio | undefined;
  adicionarExercicio: (novoExercicio: Exercicio) => void;
  editarExercicio: (ExercicioEditado: Exercicio) => void;
  excluirExercicio: (id: string) => void;
}

export const ExercicioContext = createContext<ExercicioContext | null>(null);

interface ExercicioProviderProps {
  children: ReactNode;
}

export function ExercicioProvider({children}: ExercicioProviderProps) {
//   const { getItem, setItem } = useAsyncStorage("@exercicios");
  const [exercicios, setExercicios] = useState<Exercicio[]>(MOCK_EXERCICIOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // async function lerDados() {
    //   try {
    //     const item = await getItem();
    //     setExercicios(item !== null ? JSON.parse(item) : []);
    //   } catch(e) {
    //     console.error("Erro ao carregar exercícios do AsyncStorage", e);
    //     setExercicios([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    // lerDados();
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  }, []);

//   const guardarDados = async (estadoAtual: Exercicio[]) => {
//     await setItem(JSON.stringify(estadoAtual));
//   }

  function encontrarExercicioPorID (id: string | string[]) {
    const idBusca = Array.isArray(id) ? id[0] : id;

    return exercicios.find((item) => item.id === idBusca);
  }

  function adicionarExercicio (novaExercicio: Exercicio) {
    setExercicios(estadoAtual => {
      const novoVetor = [novaExercicio, ...estadoAtual];

    //   guardarDados(novoVetor);
      return novoVetor;
    });
  }

  function editarExercicio (ExercicioEditado: Exercicio) {
    setExercicios(estadoAtual => {
      const novoVetor = estadoAtual.map((item) => item.id === ExercicioEditado.id ? ExercicioEditado: item);

    //   guardarDados(novoVetor);
      return novoVetor;
    });
  }

  function excluirExercicio (id: string) {
    setExercicios(estadoAtual => {
      const novoVetor = estadoAtual.filter(item => item.id !== id);

    //   guardarDados(novoVetor);
      return novoVetor;
    });
  }

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: myTheme.colors.background }}>
        <ActivityIndicator size="large" color={myTheme.colors.primary} />
      </View>
    );
  }

  return (
    <ExercicioContext.Provider value={{ exercicios, encontrarExercicioPorID, adicionarExercicio, editarExercicio, excluirExercicio}}>
      {children}
    </ExercicioContext.Provider>
  );
}

export function useExercicios() {
  const context = useContext(ExercicioContext);

  if (!context) {
    throw new Error("useExercicios deve ser usado dentro de um ExercicioProvider");
  }

  return context;
}