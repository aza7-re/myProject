import { json } from "../json.js" // подключаем массив данных

//FILLING

let table = document.querySelector('.table') //обрщаемся к DOM-элементу с классом(селектором) .table

for (let row of json) {
    let tr = document.createElement('tr') //создаем строку
    let td1 = document.createElement('td') //создаем ячейку 0
    let td2 = document.createElement('td') //создаем ячейку 1
    let td3 = document.createElement('td') //создаем ячейку 2
    td3.classList.add('td-dotted') // ячейке 2 присваиваем класс 'td-dotted' для отображения 2 строк
    let td4 = document.createElement('td') //создаем ячейку 3
    tr.append(td1, td2, td3, td4) //включаем в строку ячейки

    table.tBodies[0].insertAdjacentElement('beforeend', tr) //вставляем готовую строку в исходную таблицу

    td1.insertAdjacentHTML('beforeend', row.name.firstName) //вставляем данные в ячейку 0
    td2.insertAdjacentHTML('beforeend', row.name.lastName) //вставляем данные в ячейку 1
    td3.insertAdjacentHTML('beforeend', row.about) //вставляем данные в ячейку 2
    td4.insertAdjacentHTML('beforeend', row.eyeColor) //вставляем данные в ячейку 3
}

// SORTING

let rows = table.tBodies[0].rows //забираем из tBody все строки
let rowsArr = Array.from(rows) //необходимо, чтобы применить методы массива к rows
let rowsMemory = Array.from(rows) //сохраняем исходную последовательность
let isTableSorted = 1 // переменная, которая показывает, отсортирована таблица или нет

let tableHeader = table.querySelector('.table-header') //обрщаемся к DOM-элементу с классом(селектором) '.table-header'
tableHeader.onclick = sortTable //при нажатии на выбранный элемент переходим в функцию сортировки

function sortTable(e) { //функция для сортировки элементов
    let tdClicked = e.target // захватываем элемент места клика
    tdClicked = tdClicked.closest('th') // ближайший  элемент th захваченного элемента
    let colIndex = tdClicked.cellIndex // достаем индекс колонки захваченного элемента
    rowsArr.sort((row1, row2) => { //сортируем по выбранному столбцу
        if (row1.cells[colIndex].textContent > row2.cells[colIndex].textContent) {
            return 1
        } else if (row1.cells[colIndex].textContent == row2.cells[colIndex].textContent) {
            return 0
        } else {
            return -1
        }
    })
    rerenderRows(rowsArr) //переходим в функцию заполнения таблицы новыми значениями, передаем отсортированный массив
}
function rerenderRows(rows) {

    if (isTableSorted == 1) { //проверяем, отсортирована ли таблица(нет)
        table.tBodies[0].remove() //удаляем существующий tBody
        let tBody = document.createElement('tbody') //создаем новый tBody
        table.append(tBody) //созданный tBody вставляем в существующую таблицу
        tBody.append(...rows) //деструктурированно заполняем новый tBody
        isTableSorted = 0 //выставляем флаг в значение "таблица отсортирована"
    }
    else { //проверяем, отсортирована ли таблица(да)
        table.tBodies[0].remove()
        let tBody = document.createElement('tbody')
        table.append(tBody)
        tBody.append(...rowsMemory)
        isTableSorted = 1
    }
}

// EDITING

let tableSecond = document.querySelector('.table--second') //обрщаемся к DOM-элементу с классом(селектором) .table--second
let edit = document.querySelector('.edit') //обрщаемся к DOM-элементу с классом(селектором) .edit
let success = document.querySelector('.success') //обрщаемся к DOM-элементу с классом(селектором) .success
let cellSelected

table.onclick = function (e) {
    if (!e.target.closest('tbody')) { //если кликнули вне таблицы
        return
    }
    else { //если кликнули в таблице
        cellSelected = e.target.closest('td') //выбираем элемент td в месте клика
        let cellClone = cellSelected.cloneNode(true) //клонируем выбранный ДОМ элемент в переменную
        let body = tableSecond.tBodies[0]
        body.innerHTML = null //удаляем содержимое окна редактирования
        body.append(cellClone) //вставлем в tBody значение клонированного элемента
        return cellSelected //запонимаем, с какой ячейкой работаем
    }
}

edit.onclick = function () {
    let cell = tableSecond.tBodies[0].firstElementChild
    let cellContent = cell.innerHTML
    cell.innerHTML = null //очищаем окно редактирования
    let input = document.createElement('input')
    cell.append(input) //вставляем в окно редактирования тег input
    input.value = cellContent
}

success.onclick = function () {
    let cell = tableSecond.tBodies[0].firstElementChild
    let cellContent = cell.firstElementChild.value
    cell.innerHTML = null //очищаем окно редактирования
    cell.append(cellContent) //сохраняем отредактированный элемент в окне редактирования
    cellSelected.innerHTML = cellContent //вставляем в выбранную ранее ячейку новые данные
}
