import './App.css';
import './style/footer.css'
import './style/header.css'
import './style/parser_container.css'
import UserPanel from './components/Grabber'

import {BrowserRouter, Link, Navigate, Route, Routes} from 'react-router-dom'
import AuthProvider, { useAuth } from './modules/auth/AuthProvider';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Main/>
      </AuthProvider>
    </BrowserRouter>
  )
}

function Main() {
  const title = "Парсер грантов"
  const { isAuth, logout, getUsername } = useAuth()
  return (
        <div className='page'>
          <nav className='header_container'>
            <div className='content'>
              <div className='title_info'>
                <div className='title'>{title}</div>
                <div className='options_item'>{getUsername()}</div>
              </div>
              {isAuth && 
              <div className='options_container'>
                <div className='options_item'><Link  to={"/presidents"} >ФПГ</Link></div>
                <div className='options_item'><Link  to={"/creative"}>ПФКИ</Link></div>
                <div className='options_item' onClick={() => logout()}><Link  to={"#"}>Выход</Link></div>
              </div>}
            </div>
          </nav>
          <Routes>
            <Route path='*' element = {<Login/>} />
            <Route path='/presidents' element={<ProtectedRoute component={<UserPanel grantsCompany={"ФПГ"} url = {"https://xn--80afcdbalict6afooklqi5o.xn--p1ai/public/application/cards?page="}/>} />}/>
            <Route path='/creative' element = {<ProtectedRoute component={<UserPanel grantsCompany={"ПФКИ"} url = {"https://xn--80aeeqaabljrdbg6a3ahhcl4ay9hsa.xn--p1ai/public/application/cards?page="}/>} />} />
            <Route path='/login' element={<Login />} />
          </Routes>
          <div className='footer'>
            <div className='footer_info'>
              <p>Почта для связи: v.s.osipov@aoe.su</p>
              <p>ЧОУ ДПО "Южно-сибирский учебный центр"</p>
            </div>
          </div>
          </div>
     
  );
}

const ProtectedRoute = ({component}) => {
  const {isAuth} = useAuth();
  if (!isAuth) return <Navigate to="/login"/>
  return component
}

export default App;
/*
Оставить один компонент с props = URL, title
поскольку логика парсинга идентичная, включая константы
*/