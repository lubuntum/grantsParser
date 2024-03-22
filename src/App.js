import './App.css';
import './style/footer.css'
import './style/header.css'
import './style/parser_container.css'
import UserPanel from './components/Grabber'

import {BrowserRouter, Link, Route, Routes} from 'react-router-dom'
function App() {
  const title = "Парсер грантов"
  return (
    <BrowserRouter>
    <div className='page'>
      <nav className='header_container'>
        <div className='content'>
          <div className='title'>{title}</div>
          <div className='options_container'>
            <div className='options_item'><Link  to={"/presidents"} >ФПГ</Link></div>
            <div className='options_item'><Link  to={"/creative"}>ПФКИ</Link></div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path='/' element={<UserPanel grantsCompany={"ФПГ"} url = {"https://xn--80afcdbalict6afooklqi5o.xn--p1ai/public/application/cards?page="}/>}/>
        <Route path='/presidents' element={<UserPanel grantsCompany={"ФПГ"} url = {"https://xn--80afcdbalict6afooklqi5o.xn--p1ai/public/application/cards?page="}/>}/>
        <Route path='/creative' element = {<UserPanel grantsCompany={"ПФКИ (в разработке)"} url = {"https://xn--80aeeqaabljrdbg6a3ahhcl4ay9hsa.xn--p1ai/public/application/cards?page="}/>} />
      </Routes>
      <div className='footer'>
        <div className='footer_info'>
          <p>Почта для связи: someMail@gmail.com</p>
          <p>ООО "Наименование компании"</p>
        </div>
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
/*
Оставить один компонент с props = URL, title
поскольку логика парсинга идентичная, включая константы
*/