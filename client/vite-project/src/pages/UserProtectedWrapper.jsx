import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext.jsx';
import axios from 'axios';

const UserProtectedWrapper = ({children}) => {

  const token = localStorage.getItem('token');
  const { user, setUser } = React.useContext(UserDataContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
    axios.get(`${baseURL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    .then((response) => {

      // ⭐ FIX: set correct user object
      setUser(response.data.user);

      setIsLoading(false);
    })
    .catch((error) => {
      console.error(error);
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    });

  }, [token, navigate, setUser]);

  if (isLoading) {
    return null; // keep UI clean — remove flash
  }

  return <div>{children}</div>;
}

export default UserProtectedWrapper;
