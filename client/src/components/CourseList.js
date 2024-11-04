import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

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
      <h2>Available Courses</h2>
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
