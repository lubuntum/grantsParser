import '../style/login.css'
import '../style/parser_container.css'
import AuthProvider, { useAuth } from '../modules/auth/AuthProvider';
import { useState } from "react";
import {login as loginService, validateCredential} from "../modules/api/AuthAPI"
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useAuth();
    const {saveUsername, getUsername} = useAuth();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const response = await loginService(username, password);
            collectDataByToken(response.data.token)
            //Запрашиваем имя пользователя по выданному токену после логина
            
        } catch (err) {
            setError(err.message)
        }
    };

    const collectDataByToken = async (token) =>{
        const userData = await validateCredential(token)
        saveUsername(userData.data.credential.username)
        login(token);
    }

    return (
        <div className='parse_container'>
            <form onSubmit={handleSubmit}>
                <input className='form_item' type="text" placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className='form_item' type="password" placeholder="Пароль" value={password} onChange = {(e) => setPassword(e.target.value)} />
                <button className='form_item' type="submit">Войти</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default Login;