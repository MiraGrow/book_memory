// 책 데이터와 기록 데이터 관리
let books = JSON.parse(localStorage.getItem("books")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// 책 등록
document.getElementById("add-book").addEventListener("click", () => {
  const title = document.getElementById("book-title").value.trim();
  const pages = document.getElementById("book-pages").value.trim();

  if (title && pages) {
    books.push({ title, pages });
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    renderBookOptions();
    document.getElementById("book-title").value = "";
    document.getElementById("book-pages").value = "";
  }
});

// 기록 저장
document.getElementById("save-note").addEventListener("click", () => {
  const book = document.getElementById("select-book").value;
  const start = document.getElementById("page-start").value.trim();
  const end = document.getElementById("page-end").value.trim();
  const content = document.getElementById("note-content").value.trim();

  if (book && start && end && content) {
    const date = new Date().toLocaleDateString();
    notes.push({ book, start, end, content, date });
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes(book);
    document.getElementById("page-start").value = "";
    document.getElementById("page-end").value = "";
    document.getElementById("note-content").value = "";
  }
});

// 책 목록 렌더링
function renderBooks() {
  const list = document.getElementById("book-list");
  list.innerHTML = "";
  books.forEach((b, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${b.title} (총 ${b.pages}쪽) 
      <button onclick="deleteBook(${index})">삭제</button>`;
    list.appendChild(li);
  });
}

// 책 삭제
function deleteBook(index) {
  const bookTitle = books[index].title;
  books.splice(index, 1);
  // 해당 책 관련 기록도 삭제
  notes = notes.filter(n => n.book !== bookTitle);
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("notes", JSON.stringify(notes));
  renderBooks();
  renderBookOptions();
  document.getElementById("note-list").innerHTML = "";
}

// 책 선택 옵션 렌더링
function renderBookOptions() {
  const select = document.getElementById("select-book");
  select.innerHTML = "";
  books.forEach(b => {
    const option = document.createElement("option");
    option.value = b.title;
    option.textContent = b.title;
    select.appendChild(option);
  });
}

// 기록 렌더링
function renderNotes(book) {
  const list = document.getElementById("note-list");
  list.innerHTML = "";
  notes.filter(n => n.book === book).forEach((n, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${n.date}</strong> | ${n.start}~${n.end}쪽<br>${n.content}
      <button onclick="deleteNote('${book}', ${index})">삭제</button>`;
    list.appendChild(div);
  });
}

// 기록 삭제
function deleteNote(book, index) {
  const filteredNotes = notes.filter(n => n.book === book);
  const noteToDelete = filteredNotes[index];
  notes = notes.filter(n => !(n.book === noteToDelete.book && n.date === noteToDelete.date && n.start === noteToDelete.start && n.end === noteToDelete.end && n.content === noteToDelete.content));
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes(book);
}

// 초기 렌더링
renderBooks();
renderBookOptions();
if (books.length > 0) renderNotes(books[0].title);
