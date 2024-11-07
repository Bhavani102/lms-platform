import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icon imports
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Card 1: Course Creation */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/create-course')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <SchoolIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Course Creation
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Create and manage courses.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Card 2: User Management */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/user-management')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <PeopleIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    User Management
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Manage users and permissions.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Card 3: Reports */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/reports')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <AssessmentIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Reports
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    View detailed reports and insights.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Card 4: Settings */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/settings')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <SettingsIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Settings
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Adjust application settings.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
