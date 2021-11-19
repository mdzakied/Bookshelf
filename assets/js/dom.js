const UNCOMPLETED_LIST_BOOK_ID = "books";
const COMPLETED_LIST_BOOK_ID = "completed-books";
const BOOK_ITEMID = "itemId";

function makebook(title, author, year, isCompleted) {

    const textTitle = document.createElement("h1");
    textTitle.innerText = title;

    const textAuthor = document.createElement("h2");
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const btnRowContainer = document.createElement("div");
    btnRowContainer.classList.add("row")

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn")
    btnContainer.append(btnRowContainer);

    if (isCompleted) {
        btnRowContainer.append(
            createUnreadButton(),
            createTrashButton()
        );
    } else {
        btnRowContainer.append(
            createReadButton(),
            createTrashButton()
        );
    }

    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row")
    rowContainer.append(textContainer);
    rowContainer.append(btnContainer);
    
    const container = document.createElement("div");
    container.classList.add("item")
    container.append(rowContainer);

    return container;
}

function createUnreadButton() {
    return createButton("unread-button", function (event) {
        unreadTaskFromCompleted(event.target.parentElement.parentElement.parentElement.parentElement);
    });
}

function createTrashButton() {

    return createButton("trash-button", function (event) {

        swal({
            title: "Apa Anda Yakin ?", 
            text: "Buku Akan Dihapus Dari Daftar", 
            type: "warning",
            confirmButtonText: "Ya, Hapus Buku",
            showCancelButton: true
        })
        .then((result) => {
            if (result.value) {
                removeTaskFromCompleted(event.target.parentElement.parentElement.parentElement.parentElement);
                swal(
                    'Success',
                    'Buku Terhapus',
                    'success'
                  )
            } else if (result.dismiss === 'cancel') {
                swal(
                  'Cancelled',
                  'Buku Masih Disimpan',
                  'error'
                )
            }
        })
      
    });
}

function createReadButton() {
    return createButton("read-button", function (event) {
        addTaskToCompleted(event.target.parentElement.parentElement.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);

    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });

    return button;
}

function addbook() {
    const uncompletedbookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;

    const book = makebook(title, author, year, false);
    const bookObject = composebookObject(title, author, year, false);
    
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    uncompletedbookList.append(book);
    updateDataToStorage();

    swal(
        'Success',
        'Buku Berhasil Ditambahkan !',
        'success'
    )

}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".inner > h1").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h2").innerText;
    const taskYear = taskElement.querySelector(".inner > p").innerText;

    const newbook = makebook(taskTitle, taskAuthor, taskYear, true);
    

    const book = findbook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newbook[BOOK_ITEMID] = book.id;

    listCompleted.append(newbook);
    taskElement.remove();

    updateDataToStorage();

    swal(
        'Selesai Dibaca',
        'Daftar Buku Dipindahkan',
        'success'
    )
}

function removeTaskFromCompleted(taskElement) {

    const bookPosition = findbookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function unreadTaskFromCompleted(taskElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".inner > h1").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h2").innerText;
    const taskYear = taskElement.querySelector(".inner > p").innerText;
    
    const newbook = makebook(taskTitle, taskAuthor, taskYear, false);

    const book = findbook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newbook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newbook);
    taskElement.remove();
    
    updateDataToStorage();

    swal(
        'Belum Selesai Dibaca',
        'Daftar Buku Dipindahkan',
        'error'
    )
}

function refreshDataFrombooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for(book of books){
        const newbook = makebook(book.title, book.author, book.year, book.isCompleted);
        newbook[BOOK_ITEMID] = book.id;

        if(book.isCompleted){
            listCompleted.append(newbook);
        } else {
            listUncompleted.append(newbook);
        }
    }
}

searchSubmit.addEventListener("click", function(event){
    event.preventDefault();
    
    const searchValue = document.querySelector("#searchBookTitle").value.toLowerCase();
    const books = document.querySelectorAll(".inner");

    for(book of books) {

        const title = book.firstElementChild.textContent.toLowerCase();        

        if(title.toLowerCase().indexOf(searchValue) != -1) {
            book.parentElement.parentElement.style.display = "block"

        }else {
            book.parentElement.parentElement.style.display = "none"
        }

    }

    if(searchValue == ""){
        document.getElementById("searchText").style.display = "none";

        swal(
            'Judul Buku',
            'Masukan Judul Buku Yang Ingin Dicari !',
            'warning'
        )

    }else{
        document.getElementById("searchText").style.display = "block";
    }

    document.getElementById("searchWord").innerText = searchValue;
    document.getElementById("searchBook").reset();

})

searchReset.addEventListener("click", function(event){
    event.preventDefault();

    const books = document.querySelectorAll(".inner");

    for(book of books) {
        
        book.parentElement.parentElement.style.display = "block"
    }

    document.getElementById("searchText").style.display = "none";

    swal(
        'Reset',
        'Fitur Pencarian Tereset',
        'success'
    )

})