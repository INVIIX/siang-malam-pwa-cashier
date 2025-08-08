// components/data-table/confirm-delete-dialog.tsx
'use client';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogTrigger,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
}

export function ConfirmDeleteDialog({
    children,
    onConfirm,
    title = 'Apakah Anda yakin?',
    description = 'Data yang dihapus tidak dapat dikembalikan.',
    confirmText = 'Ya, hapus',
}: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
