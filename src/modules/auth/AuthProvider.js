import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('token');
        console.log(token)
        if (token) setIsAuth(true);
    }, []);
    useEffect(() => {
        console.log('isAuth updated:', isAuth); // This will log the updated value of isAuth
        if (isAuth) navigate('/presidents'); // Navigate only when isAuth changes to true
    }, [isAuth]);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuth(true);
        navigate('/presidents');
    }

    const logout = () => {
        //localStorage.removeItem('token');
        localStorage.clear()
        setIsAuth(false);
        navigate('/login');
    }
    const saveUsername = (name) =>{
        localStorage.setItem('username', name);
    }
    const getUsername = () =>{
        if (isAuth) return localStorage.getItem('username');
        return 'Гость'
    }
    return (
        <AuthContext.Provider value={{isAuth, login, logout, saveUsername, getUsername}}>
            {children}
        </AuthContext.Provider>

    );
}

export default AuthProvider;