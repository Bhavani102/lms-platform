import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Typography } from '@mui/material';
const CourseList = () => {
  const { data: courses, isLoading, isError } = useQuery('courses', async () => {
    const res = await axios.get('/api/courses');
    return res.data;
  });

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (isError || !courses) {
    return <div>Error loading courses. Please try again later.</div>;
  }

  if (!courses.length) {
    return <div>No courses available at the moment.</div>;
  }

  return (
    <div>
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
        Available Courses
      </Typography>

      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {course.title} - {course.instructor?.name ?? 'Unknown Instructor'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
