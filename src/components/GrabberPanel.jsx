function GrabberPanel({
    startPage, step, 
    count, parseDelay,
    status, pageCount,
    handleStart, handleStep,
    handleCount, handleDelay,
    handleSaveGrants, handleLoadMaxPageNumber, grantsCompany}){
        return(
            <div className="parse_container">
            <h1 style={{"margin-top":"0px"}}>Парсер для {grantsCompany}</h1>
            <h3>Параметры парсера</h3>
            <div className="main_options">
            <div className="options">
                    <div className="usability">
                        <label className="desc" htmlFor="">Начальная страница парсинга</label>
                        <input className="option" type="number" value={startPage} min={0} placeholder="Начать со страницы" onChange={handleStart}/>
                    </div>
                    <div className="usability">
                        <label className="desc" htmlFor="">Глубина парсинга (кол-во страниц)</label>
                        <input className="option" type="number" value={step} max={50} min={1} placeholder="Шаг"  onChange={handleStep}/>
                    </div>
                    <div className="usability">
                        <label className="desc" htmlFor="">Кол-во повторений парсинга</label>
                        <input className="option" type="number" value={count} max={999} min={1} placeholder="Повторить раз" onChange={handleCount} />
                    </div>
                    <div className="usability">
                        <label className="desc" htmlFor="">Задержка запросов на парсинг</label>
                        <input className="option" type="number" value={parseDelay} max={10.0} min={0.125} step={0.01} placeholder="Задержка"  onChange={handleDelay}/>
                    </div>
                    
                </div>
            </div>
                
            <p>Фильтры по датам</p>
                <div className="options">
                    <input type="date" className="option" />
                    <input type="date" className="option" />
                </div>
                <div className="options">
                <div className="usability">
                    <button className="parse_btn" onClick={handleSaveGrants}> Начать </button>
                    <p>Статус: {status}</p>
                </div>
                <div className="usability">
                    <button className="parse_btn" onClick={handleLoadMaxPageNumber}>Кол-во страниц</button>
                    <p>Страниц: {pageCount}</p>
                </div>
                </div>
                
        </div>
        )
}
export default GrabberPanel