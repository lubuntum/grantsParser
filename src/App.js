import './App.css';
import './style/footer.css'
import './style/header.css'
import './style/parser_container.css'
import UserPanel from './components/Grabber'
function App() {
  const title = "Парсер грантов"
  return (
    <>
    <div className='page'>
      <nav className='header_container'>
        <div className='content'>
          <div className='title'>{title}</div>
          <div className='options_container'>
            <div className='options_item'>ФПГ</div>
            <div className='options_item'>ПФКИ</div>
          </div>
        </div>
      </nav>
      <UserPanel/>
      <div className='footer'>
        <div className='footer_info'>
          <p>Почта для связи: someMail@gmail.com</p>
          <p>ООО "Наименование компании"</p>
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
