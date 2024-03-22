const PAGINATION_CONTAINER = "pagination"
/**
 * @doc DOM HTML document
 * функция находим максимальную страницу из пагинации
 * Структура <ul class="pagination"> <li>..</li>... <li> <a> 7073 </a></li> </ul>
 */
function getMaxPage(doc){
    let ul = doc.getElementsByClassName(PAGINATION_CONTAINER)[0]
    let listItems = ul.getElementsByTagName('li')
    let maxPageNumber = listItems[listItems.length-1].getElementsByTagName('a')[0].textContent
    return maxPageNumber
}

export async function loadMaxPageNumber(url){
    return new Promise((resolve, reject)=>{
        fetch(`${url}1`)
        .then(res => res.text())
        .then(html =>{
            const doc = document.createElement('div')
            doc.innerHTML = html
            const maxPageNumber = getMaxPage(doc)
            console.log(maxPageNumber)
            resolve(maxPageNumber)
        })
        .catch(err=>{
            console.log(err)
            reject("Error occured")
        })
    })
}
