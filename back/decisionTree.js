class DecisionNode {
  constructor(condition, yesBranch, noBranch) {
    this.condition = condition;
    this.yesBranch = yesBranch;
    this.noBranch = noBranch;
  }
}

const tree = new DecisionNode(
  (data) => data.puntaje >= 9,
  "✅ Excelente, avanza a la siguiente lección o módulo si está disponible.",
  new DecisionNode(
    (data) => data.puntaje >= 7,
    "👍 Buen trabajo. Realiza ejercicios prácticos adicionales antes de avanzar.",
    new DecisionNode(
      (data) => data.puntaje >= 5,
      "⚠️ Debes repasar la teoría y repetir la evaluación.",
      new DecisionNode(
        (data) => data.tiempo < 10,
        "⏰ Dedica más tiempo a esta lección antes de evaluarte.",
        "❌ Solicita tutoría o repaso intensivo para superar esta lección."
      )
    )
  )
);

function recorrerArbol(node, data) {
  if (typeof node === "string") return node;
  if (node.condition(data)) return recorrerArbol(node.yesBranch, data);
  return recorrerArbol(node.noBranch, data);
}

module.exports = { tree, recorrerArbol };
