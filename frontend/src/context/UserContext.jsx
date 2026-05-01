import React, { createContext, useState, useEffect } from 'react';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Error parsing stored user
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  const handleSetUser = (userData) => {
    setUser(userData);

    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <UserDataContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
