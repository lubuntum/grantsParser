import { saveGrants, addDataWorkSheet } from "./xlsxParser"

//const DIRECT_URL = 'https://xn--80afcdbalict6afooklqi5o.xn--p1ai'//Для работы с внутренними ссылками

//Внешнее описание гранта
//export const URL_DEPRECATE = "https://xn--80afcdbalict6afooklqi5o.xn--p1ai/public/application/cards?page="//Для работы с карточками
const CARD = 'cards-item-row'
//Траблы с датами ,изменитт паттерн!!!
const TITLE = "projects__title"
const CONTEST = "contest"
const DIRECTION = "direction"
const PROJECT_PRICE = "projects__price"
const PROJECT_PRICE_REG = /\d{1,3}(?: \d{3})*(?:\.\d{2})?/ //поиск цен в пример 999 999 999.99, 121 234.00, 542 154 123.00
const PROJECT_PRICE_FOND = "projects__price projects__price--fond"

const PROJECT_DESC = "projects__descr"//Контейнер вмещающий в себя элементы ниже по порядку (1,2,3 span)
//const LOCATION = ""
const PROJECT_TYPE = "projects__type"
//const PROJECT_DATE_REG = /[0-3][0-9][.\/-][0-1][0-9][.\/-]\d{2,4}/
const PROJECT_DATE_REG = /[0-3][0-9][.\/][0-1][0-9][.\/]\d{2,4}|[0-1]?[0-9][.\/][0-3]?[0-9][.\/-]\d{2,4}/
const PROJECT_REQUEST_REG = /\d+-\d+-\d+/
//Более детальное описание гранта
const WINNER_INFO = 'winner-info__list winner-info__item'
const WINNER_INFO_LIST_ITEM = 'winner-info__list-item-text'//Отдельный элемент
const INN_REG = /\b\d{10}\b/
const OGRN_REG = /\b\d{13}\b/

//const WINNER_STATUS = 'winner-info__status' Это уже было expertise
const WINNER_DETAILS = 'winner__details'
const WINNER_ANCORS = 'buttons-list buttons-list-ancors'


/* Целевые группы, цели и задачи можно спарсить одинакого это список ol -> li даже если 1 элемент*/
const SHORT_DESC_ID = '#winner-summary' 
const WINNER_SOCIAL_ID = '#winner-social'
const WINNER_AIM = '#winner-aims'
const WINNER_TASKS = '#winner-tasks'
const WINNER_GEOGRAPHY = '#winner-geography'
const WINNER_TARGET_ID = '#winner-target'
/**Контакты  */
const WINNER_CONTACTS = 'winner__details-contacts'
const WINNER_CONTACTS_LOCATION = 'winner__details-contacts-item'

const ERROR_NOTIFY = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
const NETWORK_ERR = 'Ошибка при получении страницы'
//const WINNER_WEB_SITE = 'center-link'
//let parsedGrants = []
class Grant{
    constructor(title, contest, direction, price, fondPrice,
        location, expertise, requestCode, fromDate, rating){
        this.title = title
        this.contest = contest
        this.direction = direction
        this.price = price
        this.fondPrice = fondPrice
        this.location = location
        this.expertise = expertise
        this.requestCode = requestCode
        this.fromDate = fromDate
        this.rating = rating
    }
}

function loadPage(num, url){//url
    console.log(`loading page num = ${num}`)
    return new Promise((resolve,reject)=>{
        fetch(`${url}${num}`)//`${URL}?page=${num}`
        .then(res=> res.text())
        .then(html=>{
            const doc = document.createElement('div')
            doc.innerHTML = html
            const cards = doc.getElementsByClassName(CARD)
            const grants = Array.from(cards).map(card=>{
                return parseCard(card)
            })
            //Получение ссылок на все карточки и сохранение их в связанных с ними обьектах
            filterLinksForParse(doc.getElementsByTagName('a'), url).forEach((link, index)=>{
                grants[index].tempLink = link
            })
            //loadGrantApplication(grants[0])
            

            const resJson = {
                'grants':grants
            }
            resolve(grants)
            //console.log(resJson)
    })
        .catch(err=>{
            console.log(err)
            console.log("Попытка повторного парсинга страницы грантов...")
            new Promise((resolve)=>setTimeout(resolve, 2000))
            reject(err)
            //playNotification(URL)
        })
        //resolve("Error has occured while fetching the data")
    })
    
}
async function loadGrantApplication(grant){
    return new Promise((resolve, reject)=>{
        fetch(grant.tempLink)
        .then(res=> res.text())
        .then(html=>{
            const doc = document.createElement('div')
            doc.innerHTML = html
            //grant.staus = doc.getElementsByClassName(WINNER_STATUS)[0].textContent.replace(/[А-Яа-я\w]* [А-Яа-я\w]*: */,"") Это уже было expertise
            //Два одинаковых контейнера, 0 ,весь не нужен возвращен массив
            const winnerInfo = parseWinnerInfo(doc.getElementsByClassName(WINNER_INFO)[1])
            grant.INN = searchByRegex(winnerInfo, INN_REG) //winnerInfo[2]
            grant.OGRN = searchByRegex(winnerInfo, OGRN_REG)//winnerInfo[3]
            grant.aboutOrganization = searchByRegex(winnerInfo, /[A-Za-zА-Яа-я]+/)//winnerInfo[1]
            grant.RealizeStartDate = extractDate(winnerInfo).split('-')[0].trim()//winnerInfo[0].split('-')[0].trim()
            grant.RealizeEndDate = extractDate(winnerInfo).split('-')[1].trim()//winnerInfo[0].split('-')[1].trim()

            const anchorListContainer = doc.getElementsByClassName(WINNER_ANCORS)[0]
            grant.tags = parseAnchor(anchorListContainer).join(';')

            const winnerDetails = doc.getElementsByClassName(WINNER_DETAILS)
            grant.short_desc = stripText(parseTextOnly(doc.querySelector(SHORT_DESC_ID)))
            grant.social = stripText(parseTextOnly(doc.querySelector(WINNER_SOCIAL_ID)))
            grant.aims = parseList(doc.querySelector(WINNER_AIM).getElementsByTagName('li')).join(';')
            grant.tasks = parseList(doc.querySelector(WINNER_TASKS).getElementsByTagName('li')).join(';')
            grant.geography = stripText(parseTextOnly(doc.querySelector(WINNER_GEOGRAPHY)))
            grant.winnerTarget = parseList(doc.querySelector(WINNER_TARGET_ID).getElementsByTagName('li')).join(';')

            const winnerContacts = doc.getElementsByClassName(WINNER_CONTACTS)[0]
            grant.contactLocation = winnerContacts.getElementsByClassName(WINNER_CONTACTS_LOCATION)[0].textContent
            //Если сайта нет то там лишь один эдемент
            const webSiteInfo = winnerContacts.getElementsByTagName('a')
            if(webSiteInfo[0] === undefined){
                grant.webSite = 'Веб-сайт: нет'
            }
            else if(webSiteInfo.length === 1) {
                grant.webSite = webSiteInfo[0].textContent
            }
            else grant.webSite = webSiteInfo[1].textContent
            
            resolve(`grant ${grant.title} parsed`)
        })
        .catch(err=>{
            console.log(err)
            console.log("Попытка повторного парсинга...")
            new Promise((resolve)=>setTimeout(resolve, 2000))
            reject(NETWORK_ERR)
            //playNotification(URL)
        })

    })
    
}
/*Взять оставшуюся информацию о гранте - Сроки реализации, ИНН, ОГРН, Организация*/
function parseWinnerInfo(winnerInfo){
    return Array.from(winnerInfo.getElementsByTagName('li'))
            .map(el=>{
                return stripText(el.lastElementChild.textContent)
            })
}
function parseCard(card){
    const title = card.getElementsByClassName(TITLE)[0].textContent
    const contest = card.getElementsByClassName(CONTEST)[0].textContent
    const direction = card.getElementsByClassName(DIRECTION)[0].textContent
    const price = stripPrice(card.getElementsByClassName(PROJECT_PRICE)[0].textContent)
    const fondPrice = stripPrice(card.getElementsByClassName(PROJECT_PRICE_FOND)[0].textContent)
    
    const projectDescContainer = card.getElementsByClassName(PROJECT_DESC)[0]
    const location = projectDescContainer.firstElementChild.innerHTML
    const exprestise = projectDescContainer
                        .getElementsByClassName(PROJECT_TYPE)[0]
                        .getElementsByTagName('span')[0].innerHTML
    const requestInfo = projectDescContainer.lastElementChild.innerText
    const fromDate = requestInfo.match(PROJECT_DATE_REG)[0]
    const requestCode = requestInfo.match(PROJECT_REQUEST_REG)[0]
    const rating = card.querySelector(".projects__type-rate span:last-child")?.textContent
    return new Grant(title, contest, direction, price, 
                    fondPrice, location, exprestise, requestCode, fromDate, rating )
}
function searchByRegex(dataList, reg){
    return dataList.find(el=> reg.test(el))
}
function extractDate(data){
    const date = searchByRegex(data, PROJECT_DATE_REG)
    if (date === undefined || date === null || date === '') return '00/00/0000-00/00/0000'
    return date
}
function stripPrice(price){
    return Number(price.match(PROJECT_PRICE_REG)[0].replaceAll(/\r?\n|\r/g,"").replaceAll(/ +/g,"").replace(/\.\d*/,''))
}
function stripText(text){
    return text.replaceAll(/\r?\n|\r/g,"").replaceAll(/ +/g," ").trim()
}
/**
 * Получить весь текст из контейнера игнорируя другие вложенные элементы
 */
function parseTextOnly (container){
    return Array.from(container.childNodes)
        .filter(node=>node.nodeType===Node.TEXT_NODE)
        .map(el=> el.textContent).join('')
}
function filterLinksForParse(links, url){
    return Array.from(links).map((link)=>{
        const tempLink = new URL(url)
        if(link.getElementsByClassName('cards-item-row')[0] !== undefined) 
        return tempLink.origin + link.getAttribute('href')
    }).filter(el=>el!==undefined)
}
/** Парсинг тегов гранта */
function parseAnchor(anchorListContainer){
    return Array.from(anchorListContainer.getElementsByTagName('a'))
        .map(el=>{return el.textContent})
}
/*Парсинг в текстовый массив любого ul ol списка c li*/
function parseList(listContainer){
    return Array.from(listContainer).map(el=>{return el.textContent})
}//Сделать формат для дат сейчас ошибка из за того, что возвратить нужно массив а не строку
function extractDomenName(url){

}
/**
 * 
 * Необходимо для начала парсинга, сначала загружает все данные со страницы, а затем с помощью
 * parseGrantsApplication докачивает каждый грант до конца
 */
export async function startParse(start, end, fetchDelay, url){//url
    let parsedGrants = []
    let i = start
    while(i <= end){
        let errorOccured = false
        await delay(fetchDelay)
        await loadPage(i, url)
                .then(grants=>{
                    parsedGrants.push(grants)
                })
                .catch(err=>{
                    console.log(err)
                    errorOccured = true
                })
                if(!errorOccured){
                    await parseGrantsApplication(parsedGrants[parsedGrants.length-1], fetchDelay)
                    i++
                } 
    }
    /*
    for(let i = start; i <= end;i++){//Тут тоже может возникнуть ошибка и это все может похерить(при загрузке страниц грантов)
        await delay(fetchDelay)
        await loadPage(i, url)
                .then(grants=>{
                    parsedGrants.push(grants)
                })
                .catch(err=>{
                    console.log(err)
                })
        console.log(parsedGrants)
        await parseGrantsApplication(parsedGrants[parsedGrants.length-1], fetchDelay)
    }
    */
    saveGrants(parsedGrants, start, end)
    //console.log({pages:parsedGrants})
}
async function parseGrantsApplication(grants, fetchDelay){
    console.log('parse grants package...')
    
    let i = 0;
    while(i < grants.length){
        let errorOccured = false;
        await delay(fetchDelay)
        await loadGrantApplication(grants[i])
            .then(res =>  {
                
            })
            .catch(err=>{
                console.log(err)
                errorOccured = true
            })
            
            if(!errorOccured){
                console.log(`grant ${i} fully parsed...`)
                i++
            } 
            
    }
    /*
    for(let i = 0; i < grants.length;i++){
        await delay(fetchDelay)
        await loadGrantApplication(grants[i])
            .then(res =>  console.log(`grant ${i} fully parsed...`))
            .catch(err=>{
                console.log(err)
            })
    }*/
    //addDataWorkSheet(grants)
}
function delay(ms){
    return new Promise(resolve=>{
        setTimeout(resolve, ms)
    })
}
function playNotification(url){
    const audio = new Audio(url)
    audio.play()
}
//startParse(2)
/*

function sleep (ms){
    return new Promise(resolve=>{setTimeout(resolve, ms)})
}

async function load(count, ms){
    for(let i = 0; i < count;i++){
        loadPage(i)//??Выполняем парсинг
        await sleep(ms)//Ставим задержку для следующей страницы
    }
}

delay().then(data=>{console.log(data)}).catch(err=>{console.log(err)})
*/
/*

function getAllDataByName(doc, className){
    const elements = doc.getElementsByClassName(className)
    const elementsNames = Array.from(elements).map(el=>el.textContent)
    elementsNames.forEach(el=>{
        console.log(el)
    })
    return elementsNames
}
function stripPrices(prices){
    return prices.map(price=>{
        return price.match(PROJECT_PRICE_REG)[0]
    })
}
*/

