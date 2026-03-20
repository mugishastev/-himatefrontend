import { useEffect } from 'react';

export const useDocumentTitle = (title: string, retainOnUnmount: boolean = false) => {
    useEffect(() => {
        const defaultTitle = document.title;
        // The format the user requested: Himate | Current Activity
        document.title = title ? `Himate | ${title}` : 'Himate';

        return () => {
            if (!retainOnUnmount) {
                document.title = defaultTitle;
            }
        };
    }, [title, retainOnUnmount]);
};
