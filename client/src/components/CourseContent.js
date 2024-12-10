import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, List, ListItem, Link } from '@mui/material';

const CourseContent = () => {
  const { courseName } = useParams();
  const [content, setContent] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/courses/${courseName}/content`)
      .then((response) => setContent(response.data))
      .catch((error) => console.error('Error fetching course content:', error));
  }, [courseName]);

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
      >
        Content for {courseName}
      </Typography>
      {content.length > 0 ? (
        <List>
          {content.map((item, index) => (
            <ListItem key={index}>
              {item.type === 'pdf' && item.content ? (
                <Link
                  href={`http://localhost:5000/${item.content}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.content.split('/').pop()}
                </Link>
              ) : (
                <Typography>{item.content || 'No content available'}</Typography>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No content available for this course.</Typography>
      )}
    </Container>
  );
};

export default CourseContent;
