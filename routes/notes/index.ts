const express = require('express');
const notesRouter = express.Router();
import authUserRequest from '../../middlewares/authMiddelware';
import { getAllNotesByUser, getNoteById, createNote, updateNote, deleteNote } from '../../controllers/notesController';

notesRouter
    // get note by note id
    .post('/get/:noteId', authUserRequest, getNoteById)
    // get list of all notes by user id
    .get('/list/:userId', authUserRequest, getAllNotesByUser)
    // create new note
    .post('/create/', authUserRequest, createNote)
    // edit existing note
    .post('/edit/:noteId', authUserRequest, updateNote)
    // delete existing note
    .post('/delete/:noteId', authUserRequest, deleteNote);

module.exports = notesRouter;