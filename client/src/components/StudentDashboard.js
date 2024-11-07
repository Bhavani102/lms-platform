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
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School'; // Icon for Course Enrollment

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Student Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Card 1: My Courses */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/my-courses')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <BookIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    My Courses
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    View your enrolled courses.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Card 2: Assignments */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/assignments')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <AssignmentIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Assignments
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    View and submit assignments.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Card 3: Grades */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/grades')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <GradeIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Grades
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Check your grades.
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
                    Update your account settings.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Card 5: Course Enrollment */}
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleNavigation('/course-enrollment')}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <SchoolIcon fontSize="large" color="primary" />
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Course Enrollment
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Enroll in new courses.
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

export default StudentDashboard;
