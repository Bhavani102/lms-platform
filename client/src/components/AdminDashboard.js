import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';

const AdminDashboard = () => {
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {[
          {
            icon: <SchoolIcon fontSize="large" color="primary" />,
            title: 'Course Creation',
            desc: 'Create and manage courses.',
            path: '/create-course',
          },
          {
            icon: <AssignmentIcon fontSize="large" color="primary" />,
            title: 'Assignments',
            desc: 'View and submit assignments.',
            path: '/admin-assignments',
          },
          {
            icon: <PeopleIcon fontSize="large" color="primary" />,
            title: 'User Management',
            desc: 'Manage users and permissions.',
            path: '/user-management',
          },
          {
            icon: <AssessmentIcon fontSize="large" color="primary" />,
            title: 'Reports',
            desc: 'View detailed reports and insights.',
            path: '/reports',
          },
          {
            icon: <ContentPasteIcon fontSize="large" color="primary" />,
            title: 'Manage Courses',
            desc: 'Manage and update course content.',
            path: '/manage-courses',
          },
          {
            icon: <QuizIcon fontSize="large" color="primary" />,
            title: 'Post Quiz',
            desc: 'Quiz Management for your courses.',
            path: '/admin/post-quiz',
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
          },
          {
            icon: <ContentPasteIcon fontSize="large" color="primary" />,
            title: 'Plagiarism Detection',
            desc: 'Check Similarity Scores of Student Assignments.',
            path: '/plagiarism-detection',
          },
          {
            icon: <ContentPasteIcon fontSize="large" color="primary" />,
            title: 'AI Chatbot',
            desc: 'Integrated AI Chatbot to answer queries of Instructors & Students.',
            path: '/Chatbot',
          },
        ].map((card, index) => (
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

export default AdminDashboard;
