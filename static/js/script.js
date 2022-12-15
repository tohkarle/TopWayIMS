// Upon entering 'Item Maintenance' page, assign events to search input on keyup; previous, page and next buttons on click.
assignEvents(1);


// Render the table according to the response from views.py.
function renderTable(q, object_list, suppliers, page_range, number, total_number) {
    populateTableRows(object_list, suppliers);
    populatePagination(q, page_range, number, total_number);
    assignEvents(number, total_number);
}


// For storing sorting values.
var sortValue = null;


// Function for assigning events to search input on keyup; previous, page and next buttons on click.
function assignEvents(number, total_number) {
    console.log(number)
    console.log(total_number)

    // Automatically send the input value to views.py and render the table rows after user stops typing for 500ms.
    let searchField = document.getElementById('q');
    searchField.addEventListener('keyup', function(event) {
        setTimeout(function() {
            autoAjaxRequest(searchField.value, 1);
        }, 500);    // Set to 500ms
        });

    // On page button click, table is re-rendered to display the required page of the searched value.
    let paginationButtons = document.getElementsByName('page');
    for (const paginationButton of paginationButtons) {
        if (number == paginationButton.value) {    // Highlight the current page button.
            paginationButton.setAttribute('aria-current', 'page');
            paginationButton.className ="z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
        }
        paginationButton.addEventListener('click', function(event) {
            autoAjaxRequest(searchField.value, paginationButton.value);
        });
    }

    // On previous button click, table is re-rendered to display the previous page of the searched value.
    let previousButton = document.getElementById('previous-button');
    let previous_page = number - 1;
    if (number == 1) {    // Disable the previous button if user is on first page.
        previousButton.disabled = true;
        previousButton.className = "block py-2 px-3 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
    } else {
        previousButton.addEventListener('click', function(event) {
            autoAjaxRequest(searchField.value, previous_page);
        });
    }

    // On next button click, table is re-rendered to display the next page of the searched value.
    let nextButton = document.getElementById('next-button');
    let next_page = number + 1;
    if (number == total_number) {    // Disable the next button if user is on last page.
        nextButton.disabled = true;
        nextButton.className = "block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
    } else {
        nextButton.addEventListener('click', function(event) {
            autoAjaxRequest(searchField.value, next_page);
        });
    }

    // On delete button click, the product is deleted.
    let deleteButtons = document.getElementsByName('delete-button');
    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', function(event) {
            if (confirm("Are you sure you want to delete "+deleteButton.value+"?") == true) {
                autoAjaxRequest(searchField.value, number, [deleteButton.value]);
            }
        });
    }

    // On delete selected button click, the selected product(s) are deleted.
    let checkProducts = document.getElementsByName('check-product');
    let delete_products = [];
    $('#delete-selected-button').unbind('click').bind('click', function() {
        for (const checkProduct of checkProducts) {
            if (checkProduct.checked) {
                delete_products.push(checkProduct.value);
            }
        }
        if (confirm("Are you sure you want to delete selected product(s)?") == true) {
            autoAjaxRequest(searchField.value, number, delete_products);
        }
    })

    // Check all button checks all checkboxes in the same page.
    let checkAllProduct = document.getElementById('check-all-product');
    checkAllProduct.addEventListener('click', function() {
        for (const checkProduct of checkProducts) {
            if (checkAllProduct.checked) { checkProduct.checked = true; }
            else { checkProduct.checked = false; }
        }
    });

    // Check-all-product button is unchecked by default.
    checkAllProduct.checked = false;

    // Passing the sort-button value as the query string to views.py then sort products in backend.
    $('.sort-button').unbind('click').bind('click', function() {
        if (this.value === sortValue) {
            sortValue = "-" + this.value;
        } else {
            sortValue = this.value;
        }
        autoAjaxRequest(searchField.value, number, "", sortValue);
    });
}


// Function for removing all existing table rows and populate with new/required table rows.
function populateTableRows(object_list, suppliers) {
    const tableBody = document.querySelector('#table-body');
    tableBody.innerHTML = ''; // clear the existing table rows

    for (let obj of object_list) {
        let row = document.createElement('tr');
        row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";

        // Create checkboxes in column 1
        let col1 = document.createElement('td');
        col1.setAttribute("class", "p-4 w-4");
        let div = document.createElement('div');
        div.setAttribute("class", "flex items-center");
        let input = document.createElement('input');
        input.setAttribute("value", obj[1]);
        input.setAttribute("name", "check-product");
        input.setAttribute("id", "check-product");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "check-product w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600");
        let label = document.createElement('label');
        label.setAttribute("for", "check-product");
        label.setAttribute("class", "sr-only");
        label.innerHTML = "checkbox";
        div.appendChild(input);
        div.appendChild(label);
        col1.appendChild(div);
        row.appendChild(col1);
        
        let col2 = document.createElement('td');
        col2.className = "py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white";
        col2.innerText = obj[1];
        row.appendChild(col2);

        let col3 = document.createElement('td');
        col3.className = "py-4 px-6";
        col3.innerText = obj[2];
        row.appendChild(col3);

        let col4 = document.createElement('td');
        col4.className = "py-4 px-6";
        col4.innerText = suppliers[obj[7] - 1][1];
        row.appendChild(col4);

        let col5 = document.createElement('td');
        col5.className = "py-4 px-6";
        col5.innerText = obj[5];
        row.appendChild(col5);

        let col6 = document.createElement('td');
        col6.className = "py-4 px-6";
        col6.innerText = "$"+obj[3];
        row.appendChild(col6);

        let col7 = document.createElement('td');
        col7.className = "py-4 px-6";
        col7.innerText = "$"+obj[4];
        row.appendChild(col7);

        // Create edit icon button and delete icon button in column 8
        let col8 = document.createElement('td');
        col8.setAttribute("class", "flex py-4 px-6");

        // Create edit icon button
        let a1 = document.createElement("a");
        a1.setAttribute("href", "http://127.0.0.1:8000/update-product/"+obj[0]);
        let button1 = document.createElement("button");
        button1.setAttribute("type", "button");
        button1.setAttribute("class", "mr-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2");
        let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute("class", "w-5 h-5");
        svg1.setAttribute("fill", "none");
        svg1.setAttribute("stroke", "currentColor");
        svg1.setAttribute("viewBox", "0 0 24 24");
        let path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path1.setAttribute("stroke-linecap", "round");
        path1.setAttribute("stroke-linejoin", "round");
        path1.setAttribute("stroke-width", "2");
        path1.setAttribute("d", "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z");

        // Create delete icon button
        let button2 = document.createElement("button");
        button2.setAttribute("type", "button");
        button2.setAttribute("class", "mr-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2");
        button2.setAttribute("name", "delete-button");
        button2.setAttribute("value", obj[1]);
        let svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg2.setAttribute("class", "w-5 h-5");
        svg2.setAttribute("fill", "none");
        svg2.setAttribute("stroke", "currentColor");
        svg2.setAttribute("viewBox", "0 0 24 24");
        let path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path2.setAttribute("stroke-linecap", "round");
        path2.setAttribute("stroke-linejoin", "round");
        path2.setAttribute("stroke-width", "2");
        path2.setAttribute("d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16");
        
        // Append edit icon button and delete icon button to column 8
        svg1.appendChild(path1);
        button1.appendChild(svg1);
        a1.appendChild(button1);
        col8.appendChild(a1);
        svg2.appendChild(path2);
        button2.appendChild(svg2);
        // a2.appendChild(button2);
        // col8.appendChild(a2);
        col8.appendChild(button2);
        row.appendChild(col8);

        // Lastly, append the entire row to the table body
        tableBody.appendChild(row);
    }
}


// Function for removing all existing pagination buttons and populate with new/required pagination buttons.
function populatePagination(q, page_range, number, total_number) {
    const paginationBody = document.querySelector('#pagination-controls');
    paginationBody.className = "flex justify-between items-center pt-4",
    paginationBody.innerHTML = ''; // clear the existing pagination button

    // Create "Showing (current page) of (total page)"
    let pageNumberSpan = document.createElement("span");
    pageNumberSpan.textContent = number;
    pageNumberSpan.className = "font-semibold mx-1 text-gray-900 dark:text-white";
    let numPagesSpan = document.createElement("span");
    numPagesSpan.textContent = total_number;
    numPagesSpan.className = "font-semibold mx-1 text-gray-900 dark:text-white";
    let showingSpan = document.createElement("span");
    showingSpan.textContent = "Showing";
    showingSpan.className = "text-sm font-normal text-gray-500 dark:text-gray-400";
    let ofSpan = document.createElement("span");
    ofSpan.textContent = "of";
    ofSpan.className = "text-sm font-normal text-gray-500 dark:text-gray-400";

    // Append the <span> elements to the parent element in the correct order
    paginationBody.appendChild(showingSpan);
    showingSpan.appendChild(pageNumberSpan);
    showingSpan.appendChild(ofSpan);
    showingSpan.appendChild(numPagesSpan);

    // Create a <ul> to contain the previous, page and next buttons
    let ul = document.createElement("ul");
    ul.className = "inline-flex items-center -space-x-px";

    // Create a previous button
    let previousButton = document.createElement('button');
    previousButton.setAttribute("type", "button");
    previousButton.id = 'previous-button';
    previousButton.className = 'block py-2 px-3 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';
    let srOnly1 = document.createElement('span');
    srOnly1.className = 'sr-only';
    srOnly1.innerText = 'Previous';
    let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg1.setAttribute("class", "w-5 h-5");
    svg1.setAttribute("aria-hidden", "true");
    svg1.setAttribute("fill", "currentColor");
    svg1.setAttribute("viewBox", "0 0 20 20");
    let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("fill-rule", "evenodd");
    path1.setAttribute("clip-rule", "evenodd");
    path1.setAttribute("d", "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'");

    // Append the elements to the container <ul> element in the correct order
    svg1.appendChild(path1);
    previousButton.appendChild(srOnly1);
    previousButton.appendChild(svg1);
    ul.appendChild(previousButton);
    paginationBody.appendChild(ul);
    
    // Create page buttons
    for (let page of page_range) {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('name', 'page')
        button.setAttribute('value', page)
        button.setAttribute('class', 'pagination-button py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white');
        button.innerHTML = page;

        // Append each button to the container <ul> element in the correct order
        ul.appendChild(button);
    }

    // Create next button.
    let nextButton = document.createElement('button');
    nextButton.setAttribute("type", "button");
    nextButton.id = 'next-button';
    nextButton.className = 'block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';
    let srOnly2 = document.createElement('span');
    srOnly2.className = 'sr-only';
    srOnly2.innerText = 'Next';
    let svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg2.setAttribute("class", "w-5 h-5");
    svg2.setAttribute("aria-hidden", "true");
    svg2.setAttribute("fill", "currentColor");
    svg2.setAttribute("viewBox", "0 0 20 20");
    let path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute("clip-rule", "evenodd");
    path2.setAttribute("d", "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z");
    
    // Append the elements to the container <ul> in the correct order
    svg2.appendChild(path2);
    nextButton.appendChild(srOnly2);
    nextButton.appendChild(svg2);
    ul.appendChild(nextButton);
    paginationBody.appendChild(ul);
}


// Function that takes in query strings 'q' and 'page', and send it to backend using AJAX.
function autoAjaxRequest(q, page, d, s) {
    console.log(d);
    $.ajax({
        // url: `http://127.0.0.1:8000/products/?q=`+q+'&page='+page+'&delete='+d,
        url: `http://127.0.0.1:8000/products/`,
        data: {
            "q": q,
            "page": page,
            "delete": d,
            "sort" : s
        },
        method: "GET",
        traditional: true,
        success: function(response) {
            renderTable(q,
                response.object_list,
                response.suppliers,
                response.page_range, 
                response.number, 
                response.total_number
                )
            }
    });
}

