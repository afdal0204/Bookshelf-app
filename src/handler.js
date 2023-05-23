const { nanoid } = require('nanoid');
const books = require('./books');

//Task/TODO
// API dapat menyimpan buku
// API dapat menampilkan seluruh buku
// API dapat menampilkan detail buku
// API dapat menghapus buku
// API dapat menyimpan buku


// Adding buku
const addBookHandler = (request, h) => {

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    const isAdded = books.filter((book) => book.id === id).length > 0;

    if (isAdded) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name !== undefined) {
        const filterBookByName = books.filter((book) => {
            const pattern = new RegExp(name, 'i');
            return pattern.test(book.name);
        });

        const response = h.response({
            status: 'success',
            data: {
                books: filterBookByName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (reading !== undefined) {
        const filterBookByReading = books.filter((book) => Number(reading) === Number(book.reading));

        const response = h.response({
            status: 'success',
            data: {
                books: filterBookByReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (finished !== undefined) {
        const filterBookByFinished = books.filter((book) => Number(finished) === Number(book.finished));

        const response = h.response({
            status: 'success',
            data: {
                books: filterBookByFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                })),
            },
        });

        response.code(200);
        return response;
    }

    // menampilkan seluruh buku
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            })),
        },
    });

    response.code(200);
    return response;
};

// Detail buku
const getBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

// Edit buku
const editBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        const updatedAt = new Date().toISOString();
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

// Delete buku
const deleteBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

// export module dari routes.js
module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler
};