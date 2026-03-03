import { useEffect } from 'react';
import { getThemeTokens, useProfilePreferencesStore } from '../store/profile-preferences.store';

export const ThemeSync = () => {
    const { darkMode, themeColor } = useProfilePreferencesStore();

    useEffect(() => {
        const tokens = getThemeTokens(themeColor, darkMode);
        Object.entries(tokens).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        document.documentElement.classList.toggle('dark-mode', darkMode);
    }, [darkMode, themeColor]);

    return null;
};
