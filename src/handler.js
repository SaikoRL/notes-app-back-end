const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNotesHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;

  const newNote = {
    title, tags, body, id, createAt, updateAt
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess){
    const response = h.response({
      status: 'Success',
      message: 'Catatan berhasil ditambahkan.',
      data: {
        noteId: id
      }
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'Failed',
    message: 'Catatan gagal ditemukan.'
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'Success',
  data: {
    notes,
  }
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  //   const note = notes.filter((nId)=> nId.id === id)[0];
  const note = notes.find((note) => note.id === id);

  if (note){
    return {
      status: 'Success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'Fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();

  const index = notes.findIndex((note)=> note.id === id);
  console.log(index);

  if (index !== -1){
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt
    };
    const response = h.response({
      status: 'Success',
      message: 'Berhasil mengupdate data.',
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'Failed',
    message: 'Gagal mengupdate data.'
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((data)=> data.id === id);
  if (index !== -1){
    notes.splice(index, 1);
    const response = h.response({
      status: 'Success',
      message: 'Data berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'Fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addNotesHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };