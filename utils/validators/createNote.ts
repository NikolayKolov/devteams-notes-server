import { z } from 'zod';
import { labels } from '../../config/labels';

const CreateNoteListItem = z.object({
    text: z.string().min(2, { message: labels.noteItemTextShort }).max(50, {message: 'Must be below 50 characters'}),
    order: z.number().gt(0),
    isDone: z.boolean()
})

export const CreateNote = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('TEXT'),
        title: z.string().min(2, { message: labels.noteTitleShort}).max(100, {message: 'Must be below 100 characters'}),
        userId: z.number().gt(0),
        content: z.string().min(10, { message: labels.noteContentShort}).max(1000, {message: 'Must be below 1000 characters'}),
    }),
    z.object({
        type: z.literal('CHECKLIST'),
        title: z.string().min(2, { message: labels.noteTitleShort}).max(100, {message: 'Must be below 100 characters'}),
        userId: z.number().gt(0),
        content: z.string().optional(),
        checkList: z.array(CreateNoteListItem).nonempty(),
    })
]);

export type CreateNoteType = z.infer<typeof CreateNote>;
export type CreateNoteListItemType = z.infer<typeof CreateNoteListItem>;
