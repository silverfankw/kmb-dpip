import { useTheme, alpha } from '@mui/material/styles'
import { useWindowSize } from '@hooks'
import { useMemo } from 'react'


export const useButtonStyles = (color) => {
    const theme = useTheme()
    const { isMobile } = useWindowSize()

    return useMemo(() => ({
        button: {
            margin: 0,
            backgroundColor: theme => theme.palette[color]?.main || theme.palette.primary.main,
            color: theme => theme.palette[color]?.contrastText,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            fontFamily: "Zen Kaku Gothic Antique",
            fontWeight: 500,
            fontSize: isMobile ? '1.1rem' : '1rem',
            height: isMobile ? "64px" : "48px",
            px: 2,
            py: 1,
            textTransform: 'none',
            transition: 'all 0.2s ease-in-out',
            outline: 'none',

            '&:hover': {
                backgroundColor: theme => theme.palette[color]?.dark || theme.palette.primary.dark,
                boxShadow: '0 6px 24px 0 rgba(37,99,235,0.18)',
                filter: 'brightness(1.08)',
                transform: 'translateY(-2px) scale(1.04)',
                outline: `2.5px solid ${theme.palette[color]?.dark}`,
                outlineOffset: '1px',
            },

            '&:focus-visible': {
                outline: '2.5px solid #2563eb',
                outlineOffset: '1px',
            },

            '&:active': {
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.12)',
                filter: 'brightness(0.97)',
                transform: 'scale(0.98)',
            },

            '&.Mui-disabled': {
                backgroundColor: '#2d2b2b !important',
                color: '#595555 !important',
                boxShadow: 'none',
                opacity: 1,
                border: '1px solid #2d2b2b',
                cursor: 'not-allowed',
            }
        },

        label: {
            fontSize: isMobile ? "1.25rem" : "1rem",
            whiteSpace: 'nowrap',
            fontFamily: "Zen Kaku Gothic Antique",
            fontWeight: 500,
        },

        labelWrapper: { display: "flex", alignItems: "center", gap: 6 },

        switch: {
            '& .MuiSwitch-switchBase.Mui-checked': {
                color: theme => theme.palette[color]?.light || theme.palette.primary.light,
                '&:hover': {
                    backgroundColor: theme =>
                        alpha(theme.palette[color]?.light || theme.palette.primary.light, 0.08),
                },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: theme => theme.palette[color]?.dark || theme.palette.primary.dark,
                opacity: 0.75,
            },
            transform: isMobile ? "scale(1.5)" : "scale(1.1)"
        },

        switchLabel: {
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 2 : 1
        }
    }), [color, isMobile, theme])
}
