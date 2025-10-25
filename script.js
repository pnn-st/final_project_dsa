// ==================================================
// WINNIE BOOKING - LIBRARY MANAGEMENT SYSTEM
// Complete JavaScript File
// ==================================================

// ==================================================
// DATA STRUCTURES
// ==================================================

// Book node for linked list
class BookNode {
    constructor(id, title, author, category, status = "Available", borrower = null, borrowDate = null) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.category = category;
        this.status = status;
        this.borrower = borrower;
        this.borrowDate = borrowDate;
        this.next = null;
    }
}

// Linked list for storing books (replaces array)
class BookLinkedList {
    constructor() {
        this.head = null;
    }

    // Add book to the end of list
    add(book) {
        const newNode = new BookNode(
            book.id,
            book.title,
            book.author,
            book.category,
            book.status || "Available",
            book.borrower || null,
            book.borrowDate || null
        );

        if (!this.head) {
            this.head = newNode;
            return;
        }

        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }

    // Find book by ID
    find(id) {
        const targetId = String(id);
        let current = this.head;

        while (current) {
            if (String(current.id) === targetId) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    // Remove book by ID
    remove(id) {
        const targetId = String(id);

        if (!this.head) return false;

        if (String(this.head.id) === targetId) {
            this.head = this.head.next;
            return true;
        }

        let current = this.head;
        while (current.next && String(current.next.id) !== targetId) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
            return true;
        }
        return false;
    }

    // Convert linked list to array
    toArray() {
        const result = [];
        let current = this.head;

        while (current) {
            result.push({
                id: current.id,
                title: current.title,
                author: current.author,
                category: current.category,
                status: current.status,
                borrower: current.borrower,
                borrowDate: current.borrowDate
            });
            current = current.next;
        }
        return result;
    }

    // Get total count
    getSize() {
        let count = 0;
        let current = this.head;
        while (current) {
            count++;
            current = current.next;
        }
        return count;
    }

    // Clear all books
    clear() {
        this.head = null;
    }
}

// Stack for recently added books
class BookStack {
    constructor() {
        this.items = [];
        this.maxSize = 5;
    }

    push(book) {
        this.items.push(book);
        if (this.items.length > this.maxSize) {
            this.items.shift();
        }
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    toArray() {
        return [...this.items].reverse();
    }
}

// Queue for borrowed books
class BorrowQueue {
    constructor() {
        this.items = [];
    }

    enqueue(request) {
        this.items.push({
            bookId: request.bookId,
            title: request.title,
            author: request.author,
            category: request.category,
            borrower: request.borrower,
            borrowDate: request.borrowDate
        });
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    toArray() {
        return [...this.items];
    }

    removeByBookId(bookId) {
        const targetId = String(bookId);
        this.items = this.items.filter(item => String(item.bookId) !== targetId);
    }
}

// Binary tree node for sorting
class TreeNode {
    constructor(data, key) {
        this.data = data;
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

// Binary search tree for sorting
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(data, key) {
        const newNode = new TreeNode(data, key);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        this._insertNode(this.root, newNode);
    }

    _insertNode(node, newNode) {
        const comparison = this._compareKeys(newNode.key, node.key);

        if (comparison < 0) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this._insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this._insertNode(node.right, newNode);
            }
        }
    }

    _compareKeys(key1, key2) {
        if (typeof key1 === 'string' && typeof key2 === 'string') {
            return key1.toLowerCase().localeCompare(key2.toLowerCase());
        }
        if (key1 === undefined && key2 === undefined) return 0;
        if (key1 === undefined) return 1;
        if (key2 === undefined) return -1;
        if (key1 < key2) return -1;
        if (key1 > key2) return 1;
        return 0;
    }

    inOrderTraversal() {
        const result = [];
        this._inOrder(this.root, result);
        return result;
    }

    _inOrder(node, result) {
        if (node) {
            this._inOrder(node.left, result);
            result.push(node.data);
            this._inOrder(node.right, result);
        }
    }
}

// Tree sort function (replaces quick sort)
function treeSort(array, sortKey, ascending = true) {
    if (!Array.isArray(array) || array.length <= 1) {
        return array;
    }

    const tree = new BinarySearchTree();

    for (const item of array) {
        const key = item[sortKey];
        tree.insert(item, key);
    }

    const sorted = tree.inOrderTraversal();
    return ascending ? sorted : sorted.reverse();
}

// ==================================================
// GLOBAL VARIABLES
// ==================================================

const booksList = new BookLinkedList();
const recentlyAdded = new BookStack();
const borrowQueue = new BorrowQueue();

const STORAGE_KEYS = {
    books: "winnie_library_books",
    borrowQueue: "winnie_library_borrow_queue",
    recentBooks: "winnie_library_recent_books"
};

// ==================================================
// UTILITY FUNCTIONS
// ==================================================

// Get category name from code
function getCategoryName(categoryCode) {
    const categories = {
        "01": "Fiction", "02": "Romance", "03": "Mystery", "04": "Fantasy",
        "05": "Thriller", "06": "Poetry", "07": "Arts", "08": "Non-Fiction",
        "09": "Biography", "10": "History", "11": "Science", "12": "Technology",
        "13": "Self-Help", "14": "Travel", "15": "Cooking", "16": "Children"
    };
    const code = String(categoryCode).padStart(2, "0");
    return categories[code] || "Unknown";
}

// Get category code from name
function getCategoryCodeFromName(categoryName) {
    const categoryMap = {
        "Fiction": "01", "Romance": "02", "Mystery": "03", "Fantasy": "04",
        "Thriller": "05", "Poetry": "06", "Arts": "07", "Non-Fiction": "08",
        "Biography": "09", "History": "10", "Science": "11", "Technology": "12",
        "Self-Help": "13", "Travel": "14", "Cooking": "15", "Children": "16"
    };
    return categoryMap[categoryName] || null;
}

// Generate unique book ID
function generateBookId(categoryCode) {
    const category = String(categoryCode).padStart(2, "0");

    let categoryCount = 0;
    const allBooks = booksList.toArray();

    for (const book of allBooks) {
        const bookId = String(book.id);
        if (bookId.startsWith(category)) {
            categoryCount++;
        }
    }

    const runningNumber = String(categoryCount + 1).padStart(3, "0");
    return `${category}${runningNumber}`;
}

// Show notification
function showNotification(message, type = "success") {
    const container = document.getElementById("toast-container") || document.body;
    const notification = document.createElement("div");

    const bgColor = type === "success" ? "#10b981" : "#ef4444";
    const icon = type === "success" ? "✅" : "❌";

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${bgColor}; color: white;
        padding: 16px 20px; border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 600; z-index: 9999; max-width: 350px;
        animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${icon}</span>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Navigation helper
function navigateTo(page) {
    window.location.href = page;
}

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("borrow.html")) return "borrow";
    if (path.includes("return.html")) return "return";
    if (path.includes("add.html")) return "add";
    return "index";
}

// Format date
function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ==================================================
// STORAGE FUNCTIONS
// ==================================================

// Save to localStorage
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(booksList.toArray()));
        localStorage.setItem(STORAGE_KEYS.borrowQueue, JSON.stringify(borrowQueue.toArray()));
        localStorage.setItem(STORAGE_KEYS.recentBooks, JSON.stringify(recentlyAdded.toArray()));
    } catch (error) {
        console.error("Failed to save:", error);
        showNotification("Failed to save data!", "error");
    }
}

// Load from localStorage
function loadFromStorage() {
    try {
        booksList.clear();
        borrowQueue.items = [];

        const booksData = localStorage.getItem(STORAGE_KEYS.books);
        if (booksData) {
            const books = JSON.parse(booksData);
            books.forEach(book => booksList.add(book));
        }

        const queueData = localStorage.getItem(STORAGE_KEYS.borrowQueue);
        if (queueData) {
            const requests = JSON.parse(queueData);
            requests.forEach(request => borrowQueue.enqueue(request));
        }

        const recentData = localStorage.getItem(STORAGE_KEYS.recentBooks);
        if (recentData) {
            const recent = JSON.parse(recentData);
            recent.forEach(book => recentlyAdded.push(book));
        }
    } catch (error) {
        console.error("Failed to load:", error);
    }
}

// ==================================================
// CORE FUNCTIONS
// ==================================================

// Add new book
function addBook(event) {
    if (event) event.preventDefault();

    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const categoryInput = document.getElementById("book-category");

    const title = titleInput?.value.trim();
    const author = authorInput?.value.trim();
    const category = categoryInput?.value;

    if (!title || !author || !category) {
        showNotification("Please fill in all fields!", "error");
        return;
    }

    const bookId = generateBookId(category);
    const newBook = {
        id: bookId,
        title: title,
        author: author,
        category: category,
        status: "Available",
        borrower: null,
        borrowDate: null
    };

    booksList.add(newBook);
    recentlyAdded.push(newBook);
    saveToStorage();

    if (titleInput) titleInput.value = "";
    if (authorInput) authorInput.value = "";
    if (categoryInput) categoryInput.value = "";

    showNotification(`Book "${title}" added successfully!`, "success");

    displayRecentBooks();
    updateStats();
}

// Delete book
function deleteBook(bookId) {
    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    const removed = booksList.remove(bookId);

    if (removed) {
        borrowQueue.removeByBookId(bookId);
        saveToStorage();
        showNotification("Book deleted successfully!", "success");

        const page = getCurrentPage();
        if (page === "index") displayBooks();
        if (page === "borrow") displayAvailableBooks();
        if (page === "return") displayBorrowedBooks();
        updateStats();
    } else {
        showNotification("Failed to delete book!", "error");
    }
}

// Borrow book
function borrowBook(bookId) {
    const borrowerName = prompt("Enter borrower name:");

    if (!borrowerName || borrowerName.trim() === "") {
        showNotification("Borrower name is required!", "error");
        return;
    }

    const book = booksList.find(bookId);

    if (!book) {
        showNotification("Book not found!", "error");
        return;
    }

    if (book.status !== "Available") {
        showNotification("Book is already borrowed!", "error");
        return;
    }

    book.status = "Borrowed";
    book.borrower = borrowerName.trim();
    book.borrowDate = new Date().toISOString();

    borrowQueue.enqueue({
        bookId: String(book.id),
        title: book.title,
        author: book.author,
        category: book.category,
        borrower: book.borrower,
        borrowDate: book.borrowDate
    });

    saveToStorage();
    showNotification(`Book "${book.title}" borrowed successfully!`, "success");
    displayAvailableBooks();
    updateStats();
}

// Return book
function returnBook(bookId) {
    const book = booksList.find(bookId);

    if (!book) {
        showNotification("Book not found!", "error");
        return;
    }

    if (book.status !== "Borrowed") {
        showNotification("Book is not borrowed!", "error");
        return;
    }

    book.status = "Available";
    book.borrower = null;
    book.borrowDate = null;

    borrowQueue.removeByBookId(bookId);
    saveToStorage();
    showNotification(`Book "${book.title}" returned successfully!`, "success");
    displayBorrowedBooks();
    updateStats();
}

// ==================================================
// DISPLAY FUNCTIONS
// ==================================================

// Display all books (index page)
function displayBooks() {
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    const books = booksList.toArray();
    tbody.innerHTML = "";

    if (books.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="py-8 text-center text-gray-500">
                    <div class="text-4xl mb-2">📚</div>
                    <div class="text-lg">No books in library yet</div>
                    <div class="text-sm mt-2">Add your first book or import from Excel!</div>
                </td>
            </tr>
        `;
        return;
    }

    books.forEach(book => {
        const row = tbody.insertRow();
        row.className = "hover:bg-gray-50 transition-colors";

        const statusColor = book.status === "Available"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
        const statusIcon = book.status === "Available" ? "✅" : "📖";

        row.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-700">${book.id}</td>
            <td class="py-3 px-4 font-semibold">${book.title}</td>
            <td class="py-3 px-4">${book.author}</td>
            <td class="py-3 px-4">${getCategoryName(book.category)}</td>
            <td class="py-3 px-4 text-center">
                <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColor}">
                    ${statusIcon} ${book.status}
                </span>
            </td>
            <td class="py-3 px-4 text-center">
                <button onclick="deleteBook('${book.id}')" 
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold">
                    🗑️ Delete
                </button>
            </td>
        `;
    });

    updateStats();
}

// Display available books (borrow page)
function displayAvailableBooks() {
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    const allBooks = booksList.toArray();
    const availableBooks = allBooks.filter(book => book.status === "Available");
    tbody.innerHTML = "";

    if (availableBooks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="py-8 text-center text-gray-500">
                    <div class="text-4xl mb-2">📚</div>
                    <div class="text-lg">No books available for borrowing</div>
                    <div class="text-sm mt-2">All books are currently borrowed</div>
                </td>
            </tr>
        `;
        return;
    }

    availableBooks.forEach(book => {
        const row = tbody.insertRow();
        row.className = "hover:bg-gray-50 transition-colors";

        row.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-700">${book.id}</td>
            <td class="py-3 px-4 font-semibold">${book.title}</td>
            <td class="py-3 px-4">${book.author}</td>
            <td class="py-3 px-4">${getCategoryName(book.category)}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="borrowBook('${book.id}')" 
                    class="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all text-sm font-semibold">
                    📖 Borrow
                </button>
            </td>
        `;
    });
}

// Display borrowed books (return page)
function displayBorrowedBooks() {
    const tbody = document.getElementById("return-tbody");
    if (!tbody) return;

    const borrowed = borrowQueue.toArray();
    tbody.innerHTML = "";

    if (borrowed.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-8 text-center text-gray-500">
                    <div class="text-4xl mb-2">✅</div>
                    <div class="text-lg">No books currently borrowed</div>
                    <div class="text-sm mt-2">All books have been returned</div>
                </td>
            </tr>
        `;
        return;
    }

    borrowed.forEach(item => {
        const row = tbody.insertRow();
        row.className = "hover:bg-gray-50 transition-colors";

        row.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-700">${item.bookId}</td>
            <td class="py-3 px-4 font-semibold">${item.title}</td>
            <td class="py-3 px-4">${item.author}</td>
            <td class="py-3 px-4">${getCategoryName(item.category)}</td>
            <td class="py-3 px-4">${item.borrower}</td>
            <td class="py-3 px-4 text-center">${formatDate(item.borrowDate)}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="returnBook('${item.bookId}')" 
                    class="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all text-sm font-semibold">
                    🔄 Return
                </button>
            </td>
        `;
    });
}

// Display filtered books (after search/sort on index page)
function displayFilteredBooks(books) {
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (books.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="py-8 text-center text-gray-500">
                    <div class="text-4xl mb-2">🔍</div>
                    <div class="text-lg">No books match your search</div>
                </td>
            </tr>
        `;
        return;
    }

    books.forEach(book => {
        const row = tbody.insertRow();
        row.className = "hover:bg-gray-50 transition-colors";

        const statusColor = book.status === "Available"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
        const statusIcon = book.status === "Available" ? "✅" : "📖";

        row.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-700">${book.id}</td>
            <td class="py-3 px-4 font-semibold">${book.title}</td>
            <td class="py-3 px-4">${book.author}</td>
            <td class="py-3 px-4">${getCategoryName(book.category)}</td>
            <td class="py-3 px-4 text-center">
                <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColor}">
                    ${statusIcon} ${book.status}
                </span>
            </td>
            <td class="py-3 px-4 text-center">
                <button onclick="deleteBook('${book.id}')" 
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold">
                    🗑️ Delete
                </button>
            </td>
        `;
    });
}

// Display filtered available books (after search/sort on borrow page)
function displayFilteredBooksForBorrow(books) {
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (books.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="py-8 text-center text-gray-500">
                    <div class="text-4xl mb-2">🔍</div>
                    <div class="text-lg">No available books match your search</div>
                </td>
            </tr>
        `;
        return;
    }

    books.forEach(book => {
        const row = tbody.insertRow();
        row.className = "hover:bg-gray-50 transition-colors";

        row.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-700">${book.id}</td>
            <td class="py-3 px-4 font-semibold">${book.title}</td>
            <td class="py-3 px-4">${book.author}</td>
            <td class="py-3 px-4">${getCategoryName(book.category)}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="borrowBook('${book.id}')" 
                    class="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all text-sm font-semibold">
                    📖 Borrow
                </button>
            </td>
        `;
    });
}

// Display filtered borrowed books (after search/sort on return page)
function displayFilteredBooksForReturn(items) {
    const tbody = document.getElementById("return-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-8 text-center text-gray-500">
                    <div class="text-4xl mb-2">🔍</div>
                    <div class="text-lg">No borrowed books match your search</div>
                </td>
            </tr>
        `;
        return;
    }

    items.forEach(item => {
        const row = tbody.insertRow();
        row.className = "hover:bg-gray-50 transition-colors";

        row.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-700">${item.bookId}</td>
            <td class="py-3 px-4 font-semibold">${item.title}</td>
            <td class="py-3 px-4">${item.author}</td>
            <td class="py-3 px-4">${getCategoryName(item.category)}</td>
            <td class="py-3 px-4">${item.borrower}</td>
            <td class="py-3 px-4 text-center">${formatDate(item.borrowDate)}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="returnBook('${item.bookId}')" 
                    class="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all text-sm font-semibold">
                    🔄 Return
                </button>
            </td>
        `;
    });
}

// Display recent books (add page)
function displayRecentBooks() {
    const container = document.getElementById("recent-books");
    if (!container) return;

    const recent = recentlyAdded.toArray();

    if (recent.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No recent books</p>';
        return;
    }

    container.innerHTML = recent.map(book => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div>
                <p class="font-semibold text-gray-800">${book.title}</p>
                <p class="text-sm text-gray-600">${book.author} • ${getCategoryName(book.category)}</p>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                ${book.id}
            </span>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const allBooks = booksList.toArray();
    const totalBooks = allBooks.length;
    const availableBooks = allBooks.filter(b => b.status === "Available").length;
    const borrowedBooks = allBooks.filter(b => b.status === "Borrowed").length;

    const totalEl = document.getElementById("total-books");
    const availableEl = document.getElementById("available-books");
    const borrowedEl = document.getElementById("borrowed-books");

    if (totalEl) totalEl.textContent = totalBooks;
    if (availableEl) availableEl.textContent = availableBooks;
    if (borrowedEl) borrowedEl.textContent = borrowedBooks;

    const totalStatEl = document.getElementById("total-books-stat");
    const availableStatEl = document.getElementById("available-stat");
    const borrowedStatEl = document.getElementById("borrowed-stat");

    if (totalStatEl) totalStatEl.textContent = totalBooks;
    if (availableStatEl) availableStatEl.textContent = availableBooks;
    if (borrowedStatEl) borrowedStatEl.textContent = borrowedBooks;
}

// ==================================================
// SEARCH AND SORT FUNCTIONS (USING TREE SORT)
// ==================================================

// Search books
function searchBooks() {
    const searchInput = document.getElementById("search-list");
    if (!searchInput) return;

    const term = searchInput.value.toLowerCase().trim();
    const page = getCurrentPage();

    // Prepare data based on page
    let data;
    if (page === "borrow") {
        data = booksList.toArray().filter(b => b.status === "Available");
    } else if (page === "return") {
        data = borrowQueue.toArray();
    } else {
        data = booksList.toArray();
    }

    // Filter by search term
    if (term) {
        data = data.filter(item => {
            const idText = (item.id || item.bookId || "").toString().toLowerCase();
            const titleText = (item.title || "").toLowerCase();
            const authorText = (item.author || "").toLowerCase();
            const catText = getCategoryName(item.category).toLowerCase();
            const borrowerText = (item.borrower || "").toLowerCase();

            return [idText, titleText, authorText, catText, borrowerText].some(field =>
                field.includes(term)
            );
        });
    }

    // Display results based on page
    if (page === "borrow") displayFilteredBooksForBorrow(data);
    else if (page === "return") displayFilteredBooksForReturn(data);
    else displayFilteredBooks(data);
}

// Sort books using tree sort
function sortBooks() {
    const sortSelect = document.getElementById("sort-list");
    if (!sortSelect) return;

    const page = getCurrentPage();
    const sortBy = sortSelect.value;

    // If "none" selected, display default view
    if (sortBy === "none") {
        if (page === "borrow") displayAvailableBooks();
        else if (page === "return") displayBorrowedBooks();
        else displayBooks();
        return;
    }

    // Prepare data based on page
    let data;
    if (page === "borrow") {
        data = booksList.toArray().filter(b => b.status === "Available");
    } else if (page === "return") {
        data = borrowQueue.toArray();
    } else {
        data = booksList.toArray();
    }

    // Use bookId for return page when sorting by id
    const key = (page === "return" && sortBy === "id") ? "bookId" : sortBy;

    // Sort using tree sort (replaces quick sort)
    const sorted = treeSort(data, key, true);

    // Display sorted results
    if (page === "borrow") displayFilteredBooksForBorrow(sorted);
    else if (page === "return") displayFilteredBooksForReturn(sorted);
    else displayFilteredBooks(sorted);
}

// ==================================================
// EXCEL IMPORT FUNCTION
// ==================================================

// Handle Excel file import
function handleExcelImport(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Get first sheet
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            let importedCount = 0;
            let errorCount = 0;

            // Process each row
            jsonData.forEach(row => {
                try {
                    // Validate required fields
                    if (!row.Title || !row.Author || !row.Category) {
                        errorCount++;
                        return;
                    }

                    // Get category code
                    const categoryCode = getCategoryCodeFromName(row.Category);
                    if (!categoryCode) {
                        errorCount++;
                        return;
                    }

                    // Generate ID and add book
                    const bookId = generateBookId(categoryCode);
                    const newBook = {
                        id: bookId,
                        title: row.Title.trim(),
                        author: row.Author.trim(),
                        category: categoryCode,
                        status: "Available",
                        borrower: null,
                        borrowDate: null
                    };

                    booksList.add(newBook);
                    recentlyAdded.push(newBook);
                    importedCount++;

                } catch (err) {
                    errorCount++;
                    console.error("Error processing row:", err);
                }
            });

            // Save and refresh
            saveToStorage();

            // Show result
            if (importedCount > 0) {
                showNotification(
                    `Successfully imported ${importedCount} book(s)!` +
                    (errorCount > 0 ? ` (${errorCount} error(s))` : ""),
                    "success"
                );

                // Refresh display
                const page = getCurrentPage();
                if (page === "index") displayBooks();
                if (page === "borrow") displayAvailableBooks();
                if (page === "add") displayRecentBooks();
                updateStats();
            } else {
                showNotification("No valid books found in the file!", "error");
            }

        } catch (error) {
            console.error("Excel import error:", error);
            showNotification("Failed to import Excel file!", "error");
        }
    };

    reader.readAsArrayBuffer(file);

    // Reset file input
    event.target.value = "";
}

// ==================================================
// INITIALIZATION
// ==================================================

// Initialize on page load
function initializeApp() {
    // Load data from storage
    loadFromStorage();

    // Display content based on page
    const page = getCurrentPage();

    if (page === "index") {
        displayBooks();
    } else if (page === "borrow") {
        displayAvailableBooks();
    } else if (page === "return") {
        displayBorrowedBooks();
    } else if (page === "add") {
        displayRecentBooks();
    }

    updateStats();
}

// Setup event listeners
function setupEventListeners() {
    // Add book form
    const addForm = document.getElementById("add-book-form");
    if (addForm) {
        addForm.addEventListener("submit", addBook);
    }

    // Search input
    const searchInput = document.getElementById("search-list");
    if (searchInput) {
        searchInput.addEventListener("input", searchBooks);
    }

    // Sort dropdown
    const sortSelect = document.getElementById("sort-list");
    if (sortSelect) {
        sortSelect.addEventListener("change", sortBooks);
    }

    // Excel import
    const excelInput = document.getElementById("excel-import");
    if (excelInput) {
        excelInput.addEventListener("change", handleExcelImport);
    }
}

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .hover\:scale-105:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(styleSheet);

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
    setupEventListeners();
});

// Also run on window load (backup)
window.addEventListener("load", () => {
    if (!document.getElementById("list-body") && !document.getElementById("return-tbody")) {
        return;
    }
    initializeApp();
});