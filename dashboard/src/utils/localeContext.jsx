import { createContext, useContext } from 'react';

const LocaleContext = createContext();

export function LocaleProvider({ children, locale, changeLocale }) {
    return (
        <LocaleContext.Provider value={{ locale, changeLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}