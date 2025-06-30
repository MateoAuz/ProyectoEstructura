class DecisionNode {
  constructor(condition, yesBranch, noBranch) {
    this.condition = condition;
    this.yesBranch = yesBranch;
    this.noBranch = noBranch;
  }
}

const tree = new DecisionNode(
  (data) => data.puntaje >= 9,
  "Avanzar a lección avanzada",
  new DecisionNode(
    (data) => data.puntaje >= 7,
    "Reforzar con ejercicios prácticos",
    new DecisionNode(
      (data) => data.puntaje >= 5,
      "Revisar teoría y repetir evaluación",
      "Solicitar tutoría o asistencia"
    )
  )
);

function recorrerArbol(node, data) {
  if (typeof node === "string") return node;
  if (node.condition(data)) return recorrerArbol(node.yesBranch, data);
  return recorrerArbol(node.noBranch, data);
}

module.exports = { tree, recorrerArbol };
