const { nanoid } = require('nanoid');
const books = require('./books')

const addBookHandler = (req, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage } = req.payload;
    let { reading } = req.payload;
    const id = nanoid(16);
    let finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (readPage === pageCount){
        reading = true;
        finished = true;
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    if (name){
        if (readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
              });
              response.code(400);
              return response;
        }

        books.push(newBook);
        const isSuccess = books.filter((books) => books.id === id).length > 0;

        if (isSuccess) {
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
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
};

const getAllBooksHandler = (req, h) => {
    const booksFilter = books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }));
    
    const response = h.response({
        status: 'success',
        data: {
            books: booksFilter
        }
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (req, h) => {
    const { bookId } = req.params;

    const book = books.filter((n) => n.id === bookId)[0];

    console.log(book)

    if(book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

const editBookByIdHandler = (req, h) =>{
    const { bookId } = req.params;
    const { name, year, author, summary, publisher, pageCount, readPage } = req.payload;
    let { reading } = req.payload;
    let finished = false;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (name){
        if (readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
              });
              response.code(400);
              return response;
        } 

        if(index !== -1){
            if (readPage === pageCount){
                reading = true;
                finished = true;
            }

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
            finished,
            updatedAt
            };

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
              });
              response.code(200);
              return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
          });
          response.code(404);
          return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
};

const deleteNoteByIdHandler = (req, h) =>{
    const { bookId } = req.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }

      const response = h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteNoteByIdHandler}