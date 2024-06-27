import { useEffect, useState } from 'react';

export const useGetUserID = () => {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedUserID = window.localStorage.getItem('userID');
    console.log("Retrieved userID from localStorage:", storedUserID); // Logging for debugging
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  console.log("Current userID:", userID); // Logging for debugging
  return userID;
};