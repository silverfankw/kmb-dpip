import { createTheme } from '@mui/material'

export const theme = createTheme({
    typography: {
        fontFamily: "Noto Sans, sans-serif"
    },
    palette: {
        darkRed: {
            main: '#A81919',
            light: '#EF4444',
            dark: '#991212',
            contrastText: '#FFF1F2',
        },
        nextGreen: {
            main: '#089314',
            light: '#147738',
            dark: '#077F11',
            contrastText: '#FFFFFF',
        },
        directionPurple: {
            main: '#822093',
            light: '#B983D6',
            dark: '#701C7F',
            contrastText: '#F3E8FF',
        },
        ochre: {
            main: '#E3D026',
            light: '#FFF176',
            dark: '#C4B121',
            contrastText: '#262A33',
        },
        snowwhite: {
            main: "#FFFFFF",
        }
    },
})