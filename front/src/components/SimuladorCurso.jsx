import { useEffect, useState } from 'react';
import axios from 'axios';

// Función para transformar URLs en enlaces accesibles
function autoLink(text) {
  if (!text) return "";
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}

export default function SimuladorCurso({ curso, onSalir }) {
  const [modulos, setModulos] = useState([]);
  const [lecciones, setLecciones] = useState([]);
  const [leccionActual, setLeccionActual] = useState(null);
  const [evaluacion, setEvaluacion] = useState(null);
  const [puntaje, setPuntaje] = useState('');
  const [recomendacion, setRecomendacion] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resM = await axios.get(`http://localhost:5000/api/modulos/curso/${curso.id}`);
        setModulos(resM.data);
        const resL = await axios.get('http://localhost:5000/api/lecciones');
        setLecciones(resL.data.filter(l => resM.data.some(m => m.id === l.ModuloId)));
      } catch (error) {
        setModulos([]);
        setLecciones([]);
      }
    };
    cargar();
  }, [curso]);

  const handleSeleccionLeccion = async (leccion) => {
    setLeccionActual(leccion);
    setRecomendacion(null);
    setPuntaje('');
    try {
      // Busca evaluación de esta lección
      const resE = await axios.get(`http://localhost:5000/api/evaluaciones?LeccionId=${leccion.id}`);
      setEvaluacion(resE.data.length > 0 ? resE.data[0] : null);
    } catch {
      setEvaluacion(null);
    }
  };

  const handleRegistrar = async () => {
    if (!evaluacion) return;
    try {
      // 1. Guarda el puntaje en la base de datos
      await axios.patch(`http://localhost:5000/api/evaluaciones/${evaluacion.id}/puntaje`, {
        puntaje_obtenido: parseInt(puntaje)
      });

      // 2. Envía puntaje y leccionId a la API de recomendacion
      const res = await axios.post('http://localhost:5000/api/recomendacion', {
        leccionId: leccionActual.id,
        puntaje: parseInt(puntaje)
      });
      setRecomendacion(res.data.mensaje);
    } catch {
      setRecomendacion('Ocurrió un error al obtener la recomendación o guardar el puntaje.');
    }
  };

  return (
    <div>
      <h2>Simulación de Curso: {curso.nombre}</h2>
      <button onClick={onSalir}>Volver</button>
      <ul>
        {modulos.map(mod =>
          <li key={mod.id} style={{marginBottom: 14}}>
            <b>{mod.nombre}</b>
            {mod.contenido && (
              <div
                style={{ color: "#444", fontStyle: "italic", marginBottom: 6, marginTop: 2 }}
                dangerouslySetInnerHTML={{ __html: autoLink(mod.contenido) }}
              />
            )}
            <ul>
              {lecciones.filter(l => l.ModuloId === mod.id).map(l =>
                <li key={l.id}>
                  <button onClick={() => handleSeleccionLeccion(l)}>
                    {l.nombre}
                  </button>
                </li>
              )}
            </ul>
          </li>
        )}
      </ul>
      {leccionActual && (
        <div style={{
          border: '1px solid #ccc',
          padding: 12,
          marginTop: 20,
          background: '#f7f7f7',
          maxWidth: 500
        }}>
          <h3>Lección: {leccionActual.nombre}</h3>
          <div>
            <div
              style={{ marginBottom: 10, color: "#333" }}
              dangerouslySetInnerHTML={{
                __html: autoLink(leccionActual.contenido)
              }}
            />
            {evaluacion && (
              <div>
                <h4>Evaluación</h4>
                <input
                  type="number"
                  placeholder="Tu puntaje"
                  value={puntaje}
                  onChange={e => setPuntaje(e.target.value)}
                  min={0}
                  max={10}
                  style={{ marginRight: 8 }}
                />
                <button onClick={handleRegistrar} style={{ padding: '6px 18px' }}>Registrar</button>
              </div>
            )}
            {recomendacion && (
              <div style={{
                marginTop: 18,
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 1px 5px #0001',
                maxWidth: 430
              }}>
                <div style={{
                  background: '#f7fafd',
                  fontWeight: 'bold',
                  fontSize: '1.06em',
                  padding: '8px 16px 4px 12px',
                  borderBottom: '1px solid #dce6f0',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span role="img" aria-label="idea" style={{marginRight: 8}}>💡</span>
                  Recomendación Personalizada
                </div>
                <div style={{
                  background: '#e3f2fd',
                  padding: 12,
                  fontWeight: 'bold'
                }}>
                  {recomendacion}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}