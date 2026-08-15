import { createTheme } from '@mui/material'

export const theme = createTheme({
    breakpoints: {
        values: {
            xs: 480,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536,
            '3xl': 1920,
        },
    },
    typography: {
        fontFamily: "Noto Sans, sans-serif"
    },
    palette: {
        darkRed: {
            main: '#B33B3B',
            light: '#D96A6A',
            dark: '#7E2323',
            contrastText: '#FFF8F8',
        },
        nextGreen: {
            main: '#2F9E6F',
            light: '#61C292',
            dark: '#1F7A54',
            contrastText: '#F4FFF9',
        },
        directionPurple: {
            main: '#6B4FA2',
            light: '#8A72BD',
            dark: '#48396D',
            contrastText: '#F9F5FF',
        },
        ochre: {
            main: '#C8B64D',
            light: '#E2D178',
            dark: '#A29236',
            contrastText: '#1E2430',
        },
        snowwhite: {
            main: '#F7F9FC',
        }
    },
})