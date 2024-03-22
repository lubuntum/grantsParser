import { useState } from "react";
import { startParse } from "../modules/grabber";
import { saveGrants } from "../modules/xlsxParser";
import { loadMaxPageNumber } from "../modules/maxPageCount";
import GrabberPanel from "./GrabberPanel";
function UserPanel({grantsCompany, url}){
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
        let pages = await loadMaxPageNumber(url)
        console.log(pages)
        setPageCount(pages)
    }
    const handleSaveGrants = async event =>{
        let startFromPage = startPage
        setStatus("Загрузка ...")
        
        for(let i = 0; i < count;i++){
            console.log(`start = ${startFromPage} to page ${startFromPage+step-1}`)
            await startParse(startFromPage, startFromPage + step-1, parseDelay*1000, url)
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
        <GrabberPanel startPage={startPage} step={step}
                count={count} parseDelay={parseDelay}
                status={status} pageCount={pageCount}
                handleStart={handleStart} handleStep={handleStep}
                handleCount={handleCount} handleDelay={handleDelay}
                handleSaveGrants={handleSaveGrants} handleLoadMaxPageNumber={handleLoadMaxPageNumber}
                grantsCompany={grantsCompany}/>
    )
}

export default UserPanel