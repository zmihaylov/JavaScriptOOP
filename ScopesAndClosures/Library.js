/* Task Description */
/* 
	*	Create a module for working with books
		*	The module must provide the following functionalities:
			*	Add a new book to category
				*	Each book has unique title, author and ISBN
				*	It must return the newly created book with assigned ID
				*	If the category is missing, it must be automatically created
			*	List all books
				*	Books are sorted by ID
				*	This can be done by author, by category or all
			*	List all categories
				*	Categories are sorted by ID
		*	Each book/catagory has a unique identifier (ID) that is a number greater than or equal to 1
			*	When adding a book/category, the ID is generated automatically
		*	Add validation everywhere, where possible
			*	Book title and category name must be between 2 and 100 characters, including letters, digits and special characters ('!', ',', '.', etc)
			*	Author is any non-empty string
			*	Unique params are Book title and Book ISBN
			*	Book ISBN is an unique code that contains either 10 or 13 digits
			*	If something is not valid - throw Error
*/
function solve() {
    var library = (function () {
        var books = [];
        var categories = [];
        var filter = '';
        var newBooks = [];
        var len;

        function listBooks() {
            if (!books.length) {
                return [];
            }

            if (arguments.length) {

                if (arguments[0].category !== undefined) {
                    filter = arguments[0].category;

                    for (var i = 0, len = books.length; i < len; i++) {
                        if (filter === books[i].category) {
                            newBooks.push(books[i]);
                        }
                    }

                    if (!newBooks.length) {
                        return [];
                    }

                    books = newBooks.slice();
                    newBooks = [];
                    filter = '';
                }

                if (arguments[0].author !== undefined) {
                    filter = arguments[0].author;

                    for (var j = 0, len = books.length; j < len; j++) {
                        
                        if (filter === books[j].author) {
                            newBooks.push(books[j]);
                        }
                    }

                    if (!newBooks.length) {
                        return [];
                    }

                    books = newBooks.slice();
                    newBooks = [];
                    filter = '';
                }
            }
			
			if (books.length === 1) {
                return [books[0]];
            }

            books = books.sort(function (a, b) {
                return a.ID - b.ID;
            });

            return books;
        }

        function addBook(book) {

            if (book.title.length < 2 || book.title.length > 100) {
                throw new Error();
            }
            else if (book.category.length < 2 || book.category.length > 100) {
                throw new Error();
            }
            else if (!book.author.length || book.author === undefined) {
                throw new Error();
            }
            else if (books.some(function (bookAllreadyAdded) {
                return bookAllreadyAdded.title === book.title || bookAllreadyAdded.isbn === book.isbn;
            })) {
                throw new Error();
            }
            else if (book.isbn.length !== 10 && book.isbn.length !== 13) {
                throw new Error();
            }

            book.ID = books.length + 1;
            books.push(book);

            if (!categories[book.category]) {
                categories[book.category] = [];
                categories[book.category].ID = categories.length + 1;
            }

            categories[book.category].push(book);

            return book;
        }

        function listCategories() {

            var categoriesName = [];

            Array.prototype.push.apply(categoriesName, Object.keys(categories));

            return categoriesName;
        }

        return {
            books: {
                list: listBooks,
                add: addBook
            },
            categories: {
                list: listCategories
            }
        };
    }());
    return library;
}
module.exports = solve;