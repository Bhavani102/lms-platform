import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState([{ title: '', content: '' }]);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        '/api/courses',
        { title, description, lessons },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Course created successfully');
    } catch (error) {
      console.error('Error creating course', error);
    }
  };

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', content: '' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Course</h2>
      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Course Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <h3>Lessons</h3>
      {lessons.map((lesson, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Lesson Title"
            value={lesson.title}
            onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
          />
          <textarea
            placeholder="Lesson Content"
            value={lesson.content}
            onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addLesson}>Add Lesson</button>
      <button type="submit">Create Course</button>
    </form>
  );
};

export default CreateCourse;