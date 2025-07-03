// decisionTree.js

// ✅ Recomendaciones AI quemadas
const recomendacionesAI = [
  "💡 Repasa el tema en Khan Academy.",
  "📘 Revisa las notas de clase y realiza resúmenes.",
  "🔗 Te recomendamos que apliques un metodo de estudio.",
  "🧠 Haz un mapa mental del tema para reforzar.",
  "🎥 Vuelve a ver el video de la clase para comprender mejor.",
  "✍️ Realiza un resumen breve con tus palabras para internalizar el tema.",
  "🤔 Practica con preguntas de años anteriores para reforzar tu preparación.",
  "🔊 Explica el tema en voz alta como si se lo enseñaras a un compañero.",
  "📚 Lee el capítulo adicional recomendado por tu docente.",
  "⏰ Establece un horario de repaso corto diario para evitar acumulación.",
  "📝 Escribe ejemplos propios de cada concepto para reforzar su aplicación.",
  "💭 Reflexiona sobre cómo este tema se conecta con módulos anteriores.",
  "🔬 Relaciona lo aprendido con casos reales o ejemplos de la vida diaria.",
  "📈 Revisa tus errores pasados y escribe cómo corregirlos la próxima vez.",
  "🤓 Busca videos o podcasts sobre el tema para reforzar con otro enfoque.",
  "📅 Planifica un repaso en tu agenda antes del siguiente examen.",
  "🎯 Realiza un test de autoevaluación en línea sobre el tema visto.",
  "👥 Forma un grupo de estudio para discutir y resolver dudas en conjunto.",
  "🌐 Investiga artículos o blogs recientes relacionados con la lección.",
  "🧩 Realiza ejercicios de dificultad avanzada para retarte a ti mismo."
];

function obtenerRecomendacionAleatoria() {
  const index = Math.floor(Math.random() * recomendacionesAI.length);
  return recomendacionesAI[index];
}

// 🌳 Estructura de árbol de decisión
class DecisionNode {
  constructor(condition, yesBranch, noBranch) {
    this.condition = condition;
    this.yesBranch = yesBranch;
    this.noBranch = noBranch;
  }
}

const tree = new DecisionNode(
  (data) => data.noSesionDias > 7,
  "🔔 Notificación motivacional: Hace más de 7 días que no estudias. ¡Te esperamos!",
  
  new DecisionNode(
    (data) => data.puntaje >= 9,
    "✅ Excelente, avanza al siguiente módulo o lección.",
    new DecisionNode(
      (data) => data.puntaje >= 7,
      "👍 Buen desempeño. Realiza ejercicios adicionales antes de avanzar.",
      new DecisionNode(
        (data) => data.tiempoRespuestaPromedio < 10,
        "⚠️ Respondiste muy rápido. Te sugerimos leer con más atención antes de continuar.",
        new DecisionNode(
          (data) => data.lecturasAdicionales,
          "🎯 Has estudiado más por tu cuenta. Te ofrecemos un reto avanzado opcional.",
          new DecisionNode(
            (data) => data.reintentos > 3,
            "📚 Has reintentado varias veces. Se recomienda tutoría o repaso intensivo.",
            new DecisionNode(
              (data) => !data.vioVideos,
              "🎥 Te sugerimos ver los videos del módulo antes de seguir evaluando.",
              () => obtenerRecomendacionAleatoria() // 🌟 Recomendación AI si no cumple ninguna condición anterior
            )
          )
        )
      )
    )
  )
);

function recorrerArbol(node, data) {
  if (typeof node === "string") return node;
  if (typeof node === "function") return node(); // si es función (AI aleatoria) la ejecuta
  if (node.condition(data)) return recorrerArbol(node.yesBranch, data);
  return recorrerArbol(node.noBranch, data);
}

module.exports = { tree, recorrerArbol, obtenerRecomendacionAleatoria };
