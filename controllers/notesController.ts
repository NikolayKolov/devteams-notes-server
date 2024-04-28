import { NoteType, Note, Prisma } from '@prisma/client';
import prisma from '../prisma/prismaClient';
import { JSONErrorResponse } from '../config/types';
import { labels } from '../config/labels';
import { Request, Response } from "express";
import { CreateNote, CreateNoteListItemType, CreateNoteType } from '../utils/validators/createNote';

// list all notes for the given user
export const getAllNotesByUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const notes: Note[] = await prisma.note.findMany({
            where: {
                ownerId: userId
            },
            include: {
                listItems: true
            }
        });

        res.status(200).send(notes);
    } catch (e) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorFindDB,
            message: labels.errorNoteFindMissing,
            messageOrig: (e as Error)?.message,
            stack: (e as Error)?.stack,
            name: (e as Error)?.name
        };

        res.status(500).send(errorResp);
    }
}

// get note by note Id
export const getNoteById = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const userId = res.locals.userId;

    // check if user is owner of note and can read it
    const checkNoteOwner: Note | null = await prisma.note.findUnique({
        where: {
            id: Number(noteId),
            ownerId: Number(userId)
        }
    });

    if (checkNoteOwner === null) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorAuth,
            message: labels.errorNoteOwner
        };
        res.status(403).send(errorResp);
    }
    // proceed with read

    try {
        const note = await prisma.note.findUnique({
            where: {
                id: Number(noteId)
            },
            include: {
                listItems: true
            }
        });

        res.json(note);
        res.status(200);
        res.end();
    } catch (e) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorFindDB,
            message: labels.errorNoteFindMissing,
            messageOrig: (e as Error)?.message,
            stack: (e as Error)?.stack,
            name: (e as Error)?.name
        };
        res.status(500).send(errorResp);
    }
}

// Create new note
export const createNote = async (req: Request<{}, {}, CreateNoteType>, res: Response) => {
    const { type, title, content, userId } = req.body;
    
    let typeInput: NoteType = NoteType.TEXT;
    let noteData: Prisma.NoteCreateInput = {
        title,
        type: typeInput,
        content,
        owner: {
            connect: {
                id: userId
            }
        }
    };

    const noteValidate = CreateNote.safeParse(req.body);
    if (!noteValidate.success) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorCreateDB,
            message: labels.errorNoteValidation,
        };

        res.status(500).send(errorResp);
        return;
    }

    // add checklist items, if defined
    if (type === 'CHECKLIST') {
        typeInput = NoteType.CHECKLIST;
        const checkList = req.body.checkList;
        noteData = {
            ...noteData,
            type: typeInput,
            listItems: {
                create: checkList.map((item: CreateNoteListItemType) => {
                        return {
                            text: item.text,
                            order: item.order,
                            isDone: item.isDone
                        }
                    }
                )
            }
        }
    }
    
    try {
        const note: Note = await prisma.note.create({ data: {
            ...noteData as Prisma.NoteCreateInput
        }});

        res.json(note);
        res.status(200);
        res.end();
    } catch (e) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorCreateDB,
            message: (e as Error)?.message ?? labels.errorDefault,
            messageOrig: (e as Error)?.message,
            stack: (e as Error)?.stack,
            name: (e as Error)?.name
        };
    
        res.status(500).send(errorResp)
    }
}

export const updateNote = async (req: Request<{ noteId: string}, {}, CreateNoteType>, res: Response) => {
    const noteId = req.params.noteId;
    const userId = res.locals.userId;
    const {
        title,
        content,
        type,
    } = req.body;

    const noteValidate = CreateNote.safeParse(req.body);
    if (!noteValidate.success) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorUpdateDB,
            message: labels.errorNoteValidation,
        };

        res.status(500).send(errorResp);
        return;
    }

    let noteUpdateData: Prisma.NoteUpdateInput = {
        title,
        content,
    };

    // check if user is owner of note and can edit it
    const checkNoteOwner: Note | null = await prisma.note.findUnique({
        where: {
            id: Number(noteId),
            ownerId: Number(userId)
        }
    });

    if (checkNoteOwner === null) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorAuth,
            message: labels.errorNoteOwner
        };
    
        res.status(403).send(errorResp);
    }
    // proceed with edit

    // delete all related check list items, if any
    // before adding the new ones
    if (type === 'CHECKLIST') {
        await prisma.noteChecklistItems.deleteMany({
            where: {
                ownerId: Number(noteId)
            }
        });

        const checkList = req.body.checkList;

        noteUpdateData = {
            ...noteUpdateData,
            listItems: {
                create: checkList.map((item: CreateNoteListItemType) => {
                        return {
                            text: item.text,
                            order: item.order,
                            isDone: item.isDone
                        }
                    }
                )
            }
        }
    }

    try {
        const note: Note = await prisma.note.update({
            data: { ...noteUpdateData },
            where: { id: Number(noteId) }
        });

        res.json(note);
        res.status(200);
        res.end();
    } catch(e) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorUpdateDB,
            message: labels.errorNoteUpdateMissing
        };

        res.status(500).send(errorResp);
    }
}

export const deleteNote = async (req: Request<{ noteId: string }, {}, {}>, res: Response) => {
    const noteId = req.params.noteId;
    const userId = res.locals.userId;

    // if the user is not the owner of the note, will throw an error
    // better not inform of reason for deletion, as it is a more drastic action than editing
    try {
        const note: Note = await prisma.note.delete({
            where: {
                id: Number(noteId),
                // only note owned by user will be deleted
                ownerId: Number(userId)
            }
        });

        res.json(note);
        res.status(200);
        res.end();
    } catch (e) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorDeleteDB,
            message: labels.errorNoteDeleteMissing
        };

        res.status(500).send(errorResp);
    }
}