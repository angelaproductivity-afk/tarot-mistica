import { TarotCardData } from './types';

export const COLORS = {
  background: '#120124',
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
      "Es momento de accionar y permitir que tu voluntad transmute el miedo en poder absoluto. Lo que deseas también te está buscando.",
  },
  {
    id: "aqua",
    name: "AQUA",
    image: "https://i.postimg.cc/CLNV2PBh/AQUA.jpg",
    energy: "Intuición - Entrega - Empatía",
    meaning:
      "Permite que tus emociones fluyan sin juicios; en la entrega y la suavidad reside tu mayor fortaleza.",
  },
  {
    id: "aeris",
    name: "AERIS",
    image: "https://i.postimg.cc/02q8FKVH/AERIS.jpg",
    energy: "Comunicación - Claridad - Visión",
    meaning:
      "Eleva tu perspectiva por encima del ruido mental. Observa cómo la claridad llega cuando dejas de forzar las respuestas.",
  },
  {
    id: "terra",
    name: "TERRA",
    image: "https://i.postimg.cc/ryjnXvJQ/TERRA.jpg",
    energy: "Estabilidad - Presencia - Construcción",
    meaning:
      "Estás en el momento justo para sembrar nuevas intenciones. Confía en los ciclos naturales y siembra con amor.",
  },
  {
    id: "anima",
    name: "ANIMA",
    image: "https://i.postimg.cc/8cdVNwZ7/ANIMA.jpg",
    energy: "Unidad - Propósito - Fe",
    meaning:
      "Recuerda que eres un ser espiritual viviendo una experiencia humana y que el Universo siempre conspira a tu favor.",
  },
  {
    id: "origo",
    name: "ORIGO",
    image: "https://i.postimg.cc/CLvQDWnN/ORIGO.jpg",
    energy: "Raíces - Respeto - Verdad",
    meaning:
      "Eres el fruto de incontables historias de supervivencia. Al honrar tu origen, transformas la herencia en sabiduría.",
  },
  {
    id: "inno",
    name: "INNO",
    image: "https://i.postimg.cc/RFcYHhwv/INNO.jpg",
    energy: "Presente - Creatividad - Alegría",
    meaning:
      "Vuelve a mirar el mundo con ojos de asombro. Dentro de ti vive una alegría que no conoce de juicios ni de miedos.",
  },
  {
    id: "angelos",
    name: "ANGELOS",
    image: "https://i.postimg.cc/Gp9rGFm6/ANGELOS.jpg",
    energy: "Protección - Sabiduría - Señales",
    meaning:
      "Tu familia espiritual está sosteniendo tu mano en este sendero, enviándote señales claras de que avanzas hacia tu mayor bienestar.",
  },
  {
    id: "umbra",
    name: "UMBRA",
    image: "https://i.postimg.cc/JzfK5mrm/UMBRA.jpg",
    energy: "Integración - Verdad oculta - Espejo",
    meaning:
      "Reclama las partes de tu ser que has mantenido en silencio. Acepta tu totalidad y recupera tu energía vital.",
  },
  {
    id: "semina",
    name: "SEMINA",
    image: "https://i.postimg.cc/xCSxnQhZ/SEMINA.jpg",
    energy: "Potencial - Esperanza - Gestación",
    meaning:
      "Cada gran obra comenzó siendo un susurro invisible. Lo que hoy nutres con paciencia pronto florecerá ante el mundo.",
  },
  {
    id: "centrum",
    name: "CENTRUM",
    image: "https://i.postimg.cc/595cH7m8/CENTRUM.jpg",
    energy: "Equilibrio - Paz - Soberanía",
    meaning:
      "Tu centro es el único lugar donde el tiempo se detiene y la verdad se revela. Regresa a ti cada vez que el mundo intente dictar tu rumbo.",
  },
];

export const CARD_ASPECT = 0.58; 
export const CARD_WIDTH = 3;
export const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;
