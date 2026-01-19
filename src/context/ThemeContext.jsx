import { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

const useColorMode = () => useContext(ColorModeContext);

const ThemeContextProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem('themeMode') || 'light';
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            primary: { main: '#1976d2' },
                            background: { default: '#ffffff', paper: '#f6f5f5', TableRow: '#eeeeee' },
                        }
                        : {
                            primary: { main: '#90caf9' },
                            background: { default: '#121212', paper: '#1e1e1e', TableRow: 'rgb(72, 63, 63)' },
                        }),
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export { useColorMode, ThemeContextProvider };