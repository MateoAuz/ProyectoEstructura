import { useEffect, useState } from 'react';
import axios from 'axios';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentIcon from '@mui/icons-material/Assignment';

function TreeViewCursos() {
  const [cursos, setCursos] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [lecciones, setLecciones] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resCursos = await axios.get('http://localhost:5000/api/cursos');
      const resModulos = await axios.get('http://localhost:5000/api/modulos');
      const resLecciones = await axios.get('http://localhost:5000/api/lecciones');
      const resEvaluaciones = await axios.get('http://localhost:5000/api/evaluaciones');
      setCursos(resCursos.data);
      setModulos(resModulos.data);
      setLecciones(resLecciones.data);
      setEvaluaciones(resEvaluaciones.data);
    } catch (error) {
      console.error("Error al cargar datos del árbol:", error);
    }
  };

  return (
    <TreeView
      aria-label="estructura cursos"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 500, flexGrow: 1, overflowY: 'auto', mb: 4, border: '1px solid #ccc', borderRadius: 2, p: 1 }}
    >
      {cursos.map((curso) => (
        <TreeItem
          nodeId={`curso-${curso.id}`}
          label={<><SchoolIcon sx={{ mr: 1 }} />{curso.nombre}</>}
          key={curso.id}
        >
          {modulos
            .filter((mod) => mod.CursoId === curso.id)
            .map((mod) => (
              <TreeItem
                nodeId={`mod-${mod.id}`}
                label={<><MenuBookIcon sx={{ mr: 1 }} />{mod.nombre}</>}
                key={mod.id}
              >
                {lecciones
                  .filter((lec) => lec.ModuloId === mod.id)
                  .map((lec) => (
                    <TreeItem
                      nodeId={`lec-${lec.id}`}
                      label={<><LibraryBooksIcon sx={{ mr: 1 }} />{lec.nombre}</>}
                      key={lec.id}
                    >
                      {evaluaciones
                        .filter((eva) => eva.LeccionId === lec.id)
                        .map((eva) => (
                          <TreeItem
                            nodeId={`eva-${eva.id}`}
                            label={<><AssignmentIcon sx={{ mr: 1 }} />{eva.nombre}</>}
                            key={eva.id}
                          />
                        ))}
                    </TreeItem>
                  ))}
              </TreeItem>
            ))}
        </TreeItem>
      ))}
    </TreeView>
  );
}

export default TreeViewCursos;
