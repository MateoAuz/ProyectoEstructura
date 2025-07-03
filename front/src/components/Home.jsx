import React from 'react';
import { Button, Container, Typography, Box, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleDocente = () => {
    navigate('/docente');
  };

  const handleEstudiante = () => {
    navigate('/estudiante');
  };

  return (
    <Box
      sx={{
        height: '100vh', // 👈 usa height en lugar de minHeight
        overflow: 'hidden', // 👈 oculta scroll si se generaba por margenes extra
        background: 'linear-gradient(to right, #E3F2FD, #BBDEFB)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4, boxShadow: 5 }}>
          <CardContent>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Plataforma Educativa
            </Typography>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SchoolIcon />}
                onClick={handleDocente}
                sx={{
                  mb: 2,
                  width: '80%',
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3
                }}
              >
                Ingresar como Docente
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<PersonIcon />}
                onClick={handleEstudiante}
                sx={{
                  width: '80%',
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3
                }}
              >
                Ingresar como Estudiante
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Home;
