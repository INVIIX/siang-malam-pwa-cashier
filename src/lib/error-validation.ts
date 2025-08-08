import { FieldValues, UseFormSetError, Path } from 'react-hook-form';
import { toast } from 'sonner';

/**
 * Tangani Laravel 422 dan inject error ke react-hook-form
 */
export function errorValidation<T extends FieldValues>(
    error: any,
    setError: UseFormSetError<T>
) {
    if (error?.response?.status === 422 && error.response.data?.errors) {
        const serverErrors = error.response.data.errors;
        for (const [field, messages] of Object.entries(serverErrors)) {
            if (Array.isArray(messages)) {
                setError(field as Path<T>, {
                    type: 'server',
                    message: messages[0],
                });
            }
        }
    } else {
        const message = error?.response?.data?.message ?? error?.message ?? 'Failed process';
        toast.error(message);
    }
}