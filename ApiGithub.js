const CONTEXT_PATH = "https://api.github.com/search/repositories?q="
/**
 * Поле поиска репозитория
 * @type {HTMLElement}
 */
const inp = document.getElementById("inp_rep")
/**
 * Подбор репозиториев по запросу
 * @type {HTMLElement}
 */
const autoComplete = document.getElementById("autocomplete")
/**
 * Блок с выбранными репозиториями
 * @type {HTMLElement}
 */
const infoEl = document.getElementById("info")


/**
 * Хранение всех репозиториев
 * @type {*[]}
 */
let dataBase = []

/**
 * Метод используется для получения репозиториев
 * @param event действие внутри поля поиска репозиториев
 */
async function getReps(event) {
    if (event.target.value.length > 1) {
        let url = CONTEXT_PATH + event.target.value + '&per_page=5&page=1'
        const reps = (await fetch(url, {
            headers: {
                Authorization: "token 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",
                Accept: "application/vnd.github+json"
            }
        })).json()
        reps.then(val => {
            dataBase = val.items
            fillAutocomplete(dataBase)
        })
    } else {
        for(let item of autoComplete.querySelectorAll('li')){
            autoComplete.removeChild(item)
        }

    }
}

/**
 * Формирование данных из репозитория
 * @param elem данные о репозитории
 */
const divInfo = (elem) => {
    return `<div class="infoRep" > 
                Name: ${elem.name} 
                <br>
                Owner: ${elem.owner.login}
                <br>
                Stars: ${elem.stargazers_count}
                <button class="close-btn"></button>
            </div>`;


}
/**
 * Удаления выбранного элемента
 * @param elem удаляемый элемент
 */
const closeInfo = (elem) => (event) => {
    infoEl.removeChild(elem)
}

/**
 * Метод используется для добавления записей репозитория
 *
 * @param textContent название репозитория
 */
function addInfo(textContent) {
        let findEl = dataBase.find(elem => elem.name == textContent)
        let childrens = infoEl.querySelectorAll('div')
        let html = divInfo(findEl)
        if (childrens.length < 3) {
            infoEl.innerHTML += html
        } else {
            infoEl.removeChild(childrens[0])
            infoEl.innerHTML += html
        }
        autoComplete.innerHTML = ''
        inp.value = ''
        childrens = infoEl.querySelectorAll('div')
        for (let ch of childrens) {
            ch.querySelector("button").onclick = closeInfo(ch)
        }
}

/**
 * Обработка событий
 * @param event событие
 */
function eventer(event) {
    addInfo(event.target.textContent)
}

/**
 * Заполнение автокомплита
 * @param items репозитории
 */
function fillAutocomplete(items) {
    const res = []
    for (let item of items) {
        let html = `<li class="autoLi">${item.name}</li>`
        res.push(html)
    }
    autoComplete.innerHTML = res.join('')
    const autoLi = autoComplete.querySelectorAll('.autoLi')
    for (let li of autoLi) {
        li.addEventListener('click', eventer)
    }
}


inp.addEventListener('keyup', getReps)
