import { useState } from "react";
import { startParse } from "../modules/grabber";
import { saveGrants } from "../modules/xlsxParser";
import { loadMaxPageNumber } from "../modules/maxPageCount";
function UserPanel(){
    const [status,setStatus] = useState("Не начато")
    const [startPage, setStartPage] = useState(0)
    const [step, setStep] = useState(0)
    const [count, setCount] = useState(0)
    const [parseDelay, setParseDelay] = useState(0.250)

    const [pageCount, setPageCount] = useState("")

    const handleSaveGrantsTest = event => {
        /*Идея в том, что бы собрать массив из грантов общий и сохранить его ( к примеру лимит 1000 грантов в массиве)
        сохранить его , создать док и обнулить и по новой
        */
        /**const workBook = XLSX.utils.book_new();
        const mergedJson = [jsonData, jsonData2].reduce((acc, curr)=> acc.concat(curr),[])
        console.log(mergedJson)
        const workSheet = XLSX.utils.json_to_sheet(mergedJson)
        XLSX.utils.book_append_sheet(workBook, workSheet, 'sheet')
        
        XLSX.writeFile(workBook, 'data.xlsx') */
        //startParse(20)
        setStatus("Uploading...")
    }
    const handleLoadMaxPageNumber = async event =>{
        setPageCount("Загрузка")
        let pages = await loadMaxPageNumber()
        console.log(pages)
        setPageCount(pages)
    }
    const handleSaveGrants = async event =>{
        let startFromPage = startPage
        setStatus("Загрузка ...")
        
        for(let i = 0; i < count;i++){
            console.log(`start = ${startFromPage} to page ${startFromPage+step-1}`)
            await startParse(startFromPage, startFromPage + step-1, parseDelay*1000)
            console.log(`package parsed`)
            // +1 что бы не спарсить последнюю страницу, которая уже была
            startFromPage += step 
        }
        
        setStatus("Загружено")
    }
    const handleStart = event =>{
        setStartPage(parseInt(event.target.value))
    }
    const handleStep = event =>{
        setStep(parseInt(event.target.value))
    }
    const handleCount = event =>{
        setCount(parseInt(event.target.value))
    }
    const handleDelay = event =>{
        setParseDelay(parseFloat(event.target.value))
    }
    return(
        <div className="parse_container">
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

export default UserPanel