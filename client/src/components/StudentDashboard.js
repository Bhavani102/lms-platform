import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const cardStyle = {
    height: '100%',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const cardContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
    padding: '16px',
  };

  const cards = [
    {
      icon: <BookIcon fontSize="large" color="primary" />,
      title: 'My Courses',
      desc: 'View your enrolled courses.',
      path: '/my-courses',
    },
    {
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      title: 'Assignments',
      desc: 'View and submit assignments.',
      path: '/student-assignments',
    },
    {
      icon: <SettingsIcon fontSize="large" color="primary" />,
      title: 'AI Chatbot',
      desc: 'AI Chatbot to answer your queries.',
      path: '/Chatbot',
    },
    {
      icon: <SchoolIcon fontSize="large" color="primary" />,
      title: 'Course Enrollment',
      desc: 'Enroll in new courses.',
      path: '/course-enrollment',
    },
    {
      icon: <QuizIcon fontSize="large" color="primary" />,
      title: 'Take Quiz',
      desc: 'Attempt Quizzes of your courses.',
      path: '/quiz-dashboard',
    },
    {
      icon: <ContentPasteIcon fontSize="large" color="primary" />,
      title: 'Quiz Submissions',
      desc: 'View Submitted Student Drafts.',
      path: '/quiz-submissions',
    },
    {
      icon: <ContentPasteIcon fontSize="large" color="primary" />,
      title: 'Assignment Submissions',
      desc: 'View Submitted Assignments.',
      path: '/assignment-submissions',
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
        Student Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card onClick={() => handleNavigation(card.path)} sx={cardStyle}>
              <CardActionArea sx={{ height: '100%' }}>
                <CardContent sx={cardContentStyle}>
                  {card.icon}
                  <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ wordBreak: 'break-word' }}>
                    {card.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
