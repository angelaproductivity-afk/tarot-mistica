import { TarotCardData } from './types';

export const COLORS = {
  background: '#311759',
  primaryPurple: '#2d1b4d',
  mysticCyan: '#00f2ff',
  gold: '#d4af37',
  goldLight: '#f9e29b',
};

export const TAROT_DECK: TarotCardData[] = [
  {
    id: "ignis",
    name: "IGNIS",
    image: "https://i.postimg.cc/6p3Fm9xF/IGNIS.jpg",
    energy: "Pasión - Voluntad - Inicio",
    meaning:
      "La respuesta que buscas requiere de tu acción inmediata. Confía plenamente en el fuego sagrado de tu voluntad para transformar tu realidad y permite que tu pasión guíe cada paso hoy.",
  },
  {
    id: "aqua",
    name: "AQUA",
    image: "https://i.postimg.cc/CLNV2PBh/AQUA.jpg",
    energy: "Intuición - Entrega - Empatía",
    meaning:
      "Fluye con las emociones que surgen ante tu duda actual. La suavidad abrirá puertas que la fuerza mantiene cerradas; confía plenamente en lo que dicta tu intuición en este momento.",
  },
  {
    id: "aeris",
    name: "AERIS",
    image: "https://i.postimg.cc/02q8FKVH/AERIS.jpg",
    energy: "Comunicación - Claridad - Visión",
    meaning:
      "Eleva tu mente por encima del ruido externo para encontrar claridad absoluta. La solución aparecerá naturalmente cuando dejes de forzar respuestas y simplemente te permitas observar todo con gran calma.",
  },
  {
    id: "terra",
    name: "TERRA",
    image: "https://i.postimg.cc/ryjnXvJQ/TERRA.jpg",
    energy: "Estabilidad - Presencia - Construcción",
    meaning:
      "Tu consulta requiere de paciencia y raíces sólidas. Confía en los tiempos perfectos de la naturaleza; lo que hoy siembras con dedicación florecerá con una fuerza asombrosa muy pronto, créelo.",
  },
  {
    id: "anima",
    name: "ANIMA",
    image: "https://i.postimg.cc/8cdVNwZ7/ANIMA.jpg",
    energy: "Unidad - Propósito - Fe",
    meaning:
      "Eres un ser divino viviendo esta experiencia necesaria. Confía en que el universo conspira a tu favor siempre y utiliza esta situación para evolucionar profundamente hacia tu propósito más elevado.",
  },
  {
    id: "origo",
    name: "ORIGO",
    image: "https://i.postimg.cc/CLvQDWnN/ORIGO.jpg",
    energy: "Raíces - Respeto - Verdad",
    meaning:
      "La clave reside en honrar tu historia y tus raíces profundas. Al reconocer tu origen sagrado, obtendrás la sabiduría necesaria para transformar tu presente con absoluta verdad y mucha paz.",
  },
  {
    id: "inno",
    name: "INNO",
    image: "https://i.postimg.cc/RFcYHhwv/INNO.jpg",
    energy: "Presente - Creatividad - Alegría",
    meaning:
      "Suelta los miedos del pasado y observa tu situación con asombro renovado. La alegría de tu espíritu te mostrará el camino más ligero hacia la resolución que tanto estás buscando.",
  },
  {
    id: "angelos",
    name: "ANGELOS",
    image: "https://i.postimg.cc/Gp9rGFm6/ANGELOS.jpg",
    energy: "Protección - Sabiduría - Señales",
    meaning:
      "No caminas en soledad; tus guías sostienen tu mano ahora mismo con amor. Presta mucha atención a las señales sutiles que el cielo te envía para confirmar tu rumbo actual.",
  },
  {
    id: "umbra",
    name: "UMBRA",
    image: "https://i.postimg.cc/JzfK5mrm/UMBRA.jpg",
    energy: "Integración - Verdad oculta - Espejo",
    meaning:
      "Abraza tus sombras para encontrar la luz que buscas. Al integrar cada parte de tu ser con amor, recuperarás el poder necesario para avanzar con integridad hacia un futuro mejor.",
  },
  {
    id: "semina",
    name: "SEMINA",
    image: "https://i.postimg.cc/xCSxnQhZ/SEMINA.jpg",
    energy: "Potencial - Esperanza - Gestación",
    meaning:
      "Tu intención ya es una semilla creciendo en el plano invisible. Nutre tus sueños con constancia y permite que el tiempo revele su maravillosa forma ante el mundo entero hoy.",
  },
  {
    id: "centrum",
    name: "CENTRUM",
    image: "https://i.postimg.cc/595cH7m8/CENTRUM.jpg",
    energy: "Equilibrio - Paz - Soberanía",
    meaning:
      "La respuesta definitiva habita en el silencio de tu propio corazón. Regresa a tu centro sagrado para recuperar la paz y la soberanía absoluta sobre tu destino en este momento.",
  },
];

export const CARD_ASPECT = 0.58;
export const CARD_WIDTH = 3;
export const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;