//import * as XLSX from 'xlsx'

const XLSX = require('xlsx')
export const WORK_BOOK = 'grants.xlsx'
export const WORK_SHEET = 'Grants'
let workBook = XLSX.utils.book_new()
let workSheet = XLSX.utils.json_to_sheet([])
let headers = null
export function saveGrants(data, start, end){
    //const workBook = XLSX.utils.book_new();
    //const worksheet = XLSX.utils.json_to_sheet(grants);
    data = data.reduce((acc, cur)=>acc.concat(cur),[])
    console.log(`Saving grants => ${data}`)
    workSheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workBook, workSheet,`Grants_${start}_${end}`)
    XLSX.writeFile(workBook, `Grants_${start}_${end}_${getCurrentTime()}.xlsx`)
    //update book and sheet for new data
    workBook = XLSX.utils.book_new()
    workSheet = XLSX.utils.json_to_sheet([])
}
export function addDataWorkSheet(data){
    //if(!workBook) workBook = XLSX.utils.book_new()
    //if(!workSheet) workSheet = XLSX.utils.json_to_sheet([])
    
    console.log(data)
    if(!headers){
        headers = Object.keys(data[0])//Ибо приходит массив грантов не один, а нужны заголовки
        console.log(headers)
        const sheetData = XLSX.utils.json_to_sheet(data, {headers:headers})
        XLSX.utils.sheet_add_json(workSheet, sheetData, {skipHeader: false, origin:-1})
        return
    }
    const sheetData = XLSX.utils.json_to_sheet(data, {headers:[]})
    XLSX.utils.sheet_add_json(workSheet, sheetData, {skipHeader:true, origin:-1})
}
function getCurrentTime(){
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return time
}
/*
export function addDataWorkSheet(data) {
    if (!headers) {
      headers = Object.keys(data);
      const headerRow = headers.map(header => [header]);
      workSheet = XLSX.utils.aoa_to_sheet(headerRow);
    }
    const dataRow = headers.map(header => data[header]);
    XLSX.utils.sheet_add_aoa(workSheet, [dataRow], { skipHeader: true });
}
*/
//saveGrants(jsonData)