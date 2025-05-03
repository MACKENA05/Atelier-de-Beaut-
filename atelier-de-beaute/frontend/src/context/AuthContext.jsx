import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role }

  const login = (username, password) => {
    // Fake authentication
    if (username === "admin") setUser({ username, role: "admin" });
    else if (username === "store") setUser({ username, role: "store_manager" });
    else if (username === "sales") setUser({ username, role: "sales_rep" });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
