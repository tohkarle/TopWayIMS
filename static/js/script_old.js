// Get the table and the number of rows in the table
var table = document.getElementById("product-table");
var numRows = table.rows.length;

// Set the number of rows to display per page
var rowsPerPage = 10;

// Calculate the number of pages needed
var numPages = Math.ceil(numRows / rowsPerPage);

// Set the current page to the first page
var currentPage = 1;

// Show the first page
showPage(1);

// Function to show a specific page
function showPage(page) {
// Hide all of the rows
for (var i = 1; i < numRows; i++) {
    table.rows[i].style.display = "none";
}

// Show only the rows for the current page
for (var i = (page - 1) * rowsPerPage + 1; i < (page * rowsPerPage) + 1 && i < numRows; i++) {
    table.rows[i].style.display = "table-row";
}

// Update the current page number
currentPage = page;

// Update the "Showing 1-10 of 1000" text
document.getElementById("row-number").innerHTML = ((page - 1) * rowsPerPage + 1) + "-" + (page * rowsPerPage);
// var rowRange = document.getElementById("show-row-number");
// rowRange.innerHTML = "Showing " + ((page - 1) * rowsPerPage + 1) + "-" + (page * rowsPerPage);

// Update the "page-number" button to show the current page
var pageNumber = document.getElementById("page-number");
pageNumber.innerHTML = currentPage;
}

// Function to go to the previous page
function previousPage() {
if (currentPage > 1) {
    showPage(currentPage - 1);
}
}

// Function to go to the next page
function nextPage() {
if (currentPage < numPages) {
    showPage(currentPage + 1);
}
}

// Add event listeners for the pagination buttons
document.getElementById("previous-button").addEventListener("click", previousPage);
document.getElementById("next-button").addEventListener("click", nextPage);
document.getElementById("page-number").addEventListener("click", function() {
showPage(currentPage);
}); 



function selectAll(source) {
    checkboxes = document.getElementsByName('check-product');
    for(var i in checkboxes)
        checkboxes[i].checked = source.checked;
}


function searchTable() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("table-search");
    filter = input.value.toUpperCase();
    table = document.getElementById("product-table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else if (tr[i].id != 'tableHeader') {
            tr[i].style.display = "none";
        }
    }
}


'use strict';
class SortableTable {
constructor(tableNode) {
    this.tableNode = tableNode;

    this.columnHeaders = tableNode.querySelectorAll('thead th');

    this.sortColumns = [];

    for (var i = 0; i < this.columnHeaders.length; i++) {
    var ch = this.columnHeaders[i];
    var buttonNode = ch.querySelector('button');
    if (buttonNode) {
        this.sortColumns.push(i);
        buttonNode.setAttribute('data-column-index', i);
        buttonNode.addEventListener('click', this.handleClick.bind(this));
    }
    }

    this.optionCheckbox = document.querySelector(
    'input[type="checkbox"][value="show-unsorted-icon"]'
    );

    if (this.optionCheckbox) {
    this.optionCheckbox.addEventListener(
        'change',
        this.handleOptionChange.bind(this)
    );
    if (this.optionCheckbox.checked) {
        this.tableNode.classList.add('show-unsorted-icon');
    }
    }
}

setColumnHeaderSort(columnIndex) {
    if (typeof columnIndex === 'string') {
    columnIndex = parseInt(columnIndex);
    }

    for (var i = 0; i < this.columnHeaders.length; i++) {
    var ch = this.columnHeaders[i];
    var buttonNode = ch.querySelector('button');
    if (i === columnIndex) {
        var value = ch.getAttribute('aria-sort');
        if (value === 'descending') {
        ch.setAttribute('aria-sort', 'ascending');
        this.sortColumn(
            columnIndex,
            'ascending',
            ch.classList.contains('num')
        );
        } else {
        ch.setAttribute('aria-sort', 'descending');
        this.sortColumn(
            columnIndex,
            'descending',
            ch.classList.contains('num')
        );
        }
    } else {
        if (ch.hasAttribute('aria-sort') && buttonNode) {
        ch.removeAttribute('aria-sort');
        }
    }
    }
}

sortColumn(columnIndex, sortValue, isNumber) {
    function compareValues(a, b) {
    if (sortValue === 'ascending') {
        if (a.value === b.value) {
        return 0;
        } else {
        if (isNumber) {
            return a.value - b.value;
        } else {
            return a.value < b.value ? -1 : 1;
        }
        }
    } else {
        if (a.value === b.value) {
        return 0;
        } else {
        if (isNumber) {
            return b.value - a.value;
        } else {
            return a.value > b.value ? -1 : 1;
        }
        }
    }
    }

    if (typeof isNumber !== 'boolean') {
    isNumber = false;
    }

    var tbodyNode = this.tableNode.querySelector('tbody');
    var rowNodes = [];
    var dataCells = [];

    var rowNode = tbodyNode.firstElementChild;

    var index = 0;
    while (rowNode) {
    rowNodes.push(rowNode);
    var rowCells = rowNode.querySelectorAll('th, td');
    var dataCell = rowCells[columnIndex];

    var data = {};
    data.index = index;
    data.value = dataCell.textContent.toLowerCase().trim();
    if (isNumber) {
        data.value = parseFloat(data.value);
    }
    dataCells.push(data);
    rowNode = rowNode.nextElementSibling;
    index += 1;
    }

    dataCells.sort(compareValues);

    // remove rows
    while (tbodyNode.firstChild) {
    tbodyNode.removeChild(tbodyNode.lastChild);
    }

    // add sorted rows
    for (var i = 0; i < dataCells.length; i += 1) {
    tbodyNode.appendChild(rowNodes[dataCells[i].index]);
    }
}

/* EVENT HANDLERS */

handleClick(event) {
    var tgt = event.currentTarget;
    this.setColumnHeaderSort(tgt.getAttribute('data-column-index'));
}

handleOptionChange(event) {
    var tgt = event.currentTarget;

    if (tgt.checked) {
    this.tableNode.classList.add('show-unsorted-icon');
    } else {
    this.tableNode.classList.remove('show-unsorted-icon');
    }
}
}

// Initialize sortable table buttons
window.addEventListener('load', function () {
var sortableTables = document.querySelectorAll('table.sortable');
for (var i = 0; i < sortableTables.length; i++) {
    new SortableTable(sortableTables[i]);
}
});

function searchTable() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("table-search");
    filter = input.value.toUpperCase();
    table = document.getElementById("product-table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else if (tr[i].id != 'tableHeader') {
            tr[i].style.display = "none";
        }
    }
}

'use strict';
class SortableTable {
constructor(tableNode) {
    this.tableNode = tableNode;

    this.columnHeaders = tableNode.querySelectorAll('thead th');

    this.sortColumns = [];

    for (var i = 0; i < this.columnHeaders.length; i++) {
    var ch = this.columnHeaders[i];
    var buttonNode = ch.querySelector('button');
    if (buttonNode) {
        this.sortColumns.push(i);
        buttonNode.setAttribute('data-column-index', i);
        buttonNode.addEventListener('click', this.handleClick.bind(this));
    }
    }

    this.optionCheckbox = document.querySelector(
    'input[type="checkbox"][value="show-unsorted-icon"]'
    );

    if (this.optionCheckbox) {
    this.optionCheckbox.addEventListener(
        'change',
        this.handleOptionChange.bind(this)
    );
    if (this.optionCheckbox.checked) {
        this.tableNode.classList.add('show-unsorted-icon');
    }
    }
}

setColumnHeaderSort(columnIndex) {
    if (typeof columnIndex === 'string') {
    columnIndex = parseInt(columnIndex);
    }

    for (var i = 0; i < this.columnHeaders.length; i++) {
    var ch = this.columnHeaders[i];
    var buttonNode = ch.querySelector('button');
    if (i === columnIndex) {
        var value = ch.getAttribute('aria-sort');
        if (value === 'descending') {
        ch.setAttribute('aria-sort', 'ascending');
        this.sortColumn(
            columnIndex,
            'ascending',
            ch.classList.contains('num')
        );
        } else {
        ch.setAttribute('aria-sort', 'descending');
        this.sortColumn(
            columnIndex,
            'descending',
            ch.classList.contains('num')
        );
        }
    } else {
        if (ch.hasAttribute('aria-sort') && buttonNode) {
        ch.removeAttribute('aria-sort');
        }
    }
    }
}

sortColumn(columnIndex, sortValue, isNumber) {
    function compareValues(a, b) {
    if (sortValue === 'ascending') {
        if (a.value === b.value) {
        return 0;
        } else {
        if (isNumber) {
            return a.value - b.value;
        } else {
            return a.value < b.value ? -1 : 1;
        }
        }
    } else {
        if (a.value === b.value) {
        return 0;
        } else {
        if (isNumber) {
            return b.value - a.value;
        } else {
            return a.value > b.value ? -1 : 1;
        }
        }
    }
    }

    if (typeof isNumber !== 'boolean') {
    isNumber = false;
    }

    var tbodyNode = this.tableNode.querySelector('tbody');
    var rowNodes = [];
    var dataCells = [];

    var rowNode = tbodyNode.firstElementChild;

    var index = 0;
    while (rowNode) {
    rowNodes.push(rowNode);
    var rowCells = rowNode.querySelectorAll('th, td');
    var dataCell = rowCells[columnIndex];

    var data = {};
    data.index = index;
    data.value = dataCell.textContent.toLowerCase().trim();
    if (isNumber) {
        data.value = parseFloat(data.value);
    }
    dataCells.push(data);
    rowNode = rowNode.nextElementSibling;
    index += 1;
    }

    dataCells.sort(compareValues);

    // remove rows
    while (tbodyNode.firstChild) {
    tbodyNode.removeChild(tbodyNode.lastChild);
    }

    // add sorted rows
    for (var i = 0; i < dataCells.length; i += 1) {
    tbodyNode.appendChild(rowNodes[dataCells[i].index]);
    }
}

/* EVENT HANDLERS */

handleClick(event) {
    var tgt = event.currentTarget;
    this.setColumnHeaderSort(tgt.getAttribute('data-column-index'));
}

handleOptionChange(event) {
    var tgt = event.currentTarget;

    if (tgt.checked) {
    this.tableNode.classList.add('show-unsorted-icon');
    } else {
    this.tableNode.classList.remove('show-unsorted-icon');
    }
}
}

// Initialize sortable table buttons
window.addEventListener('load', function () {
var sortableTables = document.querySelectorAll('table.sortable');
for (var i = 0; i < sortableTables.length; i++) {
    new SortableTable(sortableTables[i]);
}
});