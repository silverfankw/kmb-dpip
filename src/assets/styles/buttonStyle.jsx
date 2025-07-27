import { useTheme, alpha } from '@mui/material/styles'
import { useWindowSize } from '@hooks'
import { useMemo } from 'react'

export const useButtonStyles = (color) => {
    const theme = useTheme()
    const { isMobile } = useWindowSize()

    return useMemo(() => ({
        button: {
            margin: 0,
            background: theme => `linear-gradient(135deg, 
                ${alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.9)},
                ${alpha(theme.palette[color]?.dark || theme.palette.primary.dark, 0.8)}
            )`,
            backdropFilter: 'blur(8px)',
            color: theme => theme.palette[color]?.contrastText,
            borderRadius: '12px',
            border: theme => `1px solid ${alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.3)}`,
            boxShadow: `
                0 4px 12px rgba(0, 0, 0, 0.1),
                inset 0 1px 1px rgba(255, 255, 255, 0.1)
            `,
            fontFamily: "Zen Kaku Gothic Antique",
            fontWeight: 500,
            fontSize: isMobile ? '1.1rem' : '1rem',
            height: isMobile ? "64px" : "48px",
            px: 3,
            py: 1.5,
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,

            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s ease',
                zIndex: -1,
            },

            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme => `
                    0 8px 24px ${alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.25)},
                    inset 0 1px 1px rgba(255, 255, 255, 0.2)
                `,
                border: theme => `1px solid ${alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.5)}`,
                '&::before': {
                    transform: 'translateX(100%)',
                },
            },

            '&:focus-visible': {
                outline: 'none',
                boxShadow: theme => `
                    0 0 0 2px ${alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.4)},
                    0 8px 24px ${alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.25)}
                `,
            },

            '&:active': {
                transform: 'translateY(1px) scale(0.98)',
                boxShadow: `
                    0 2px 8px rgba(0, 0, 0, 0.1),
                    inset 0 1px 2px rgba(0, 0, 0, 0.1)
                `,
            },

            '&.Mui-disabled': {
                background: 'rgba(45, 43, 43, 0.6)',
                backdropFilter: 'blur(4px)',
                color: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(89, 85, 85, 0.2)',
                boxShadow: 'none',
                cursor: 'not-allowed',
            }
        },

        label: {
            fontSize: isMobile ? "1.25rem" : "1rem",
            whiteSpace: 'nowrap',
            fontFamily: "Zen Kaku Gothic Antique",
            fontWeight: 500,
            letterSpacing: '0.01em',
        },

        labelWrapper: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            position: 'relative',
            zIndex: 2,
        },

        switch: {
            '& .MuiSwitch-switchBase.Mui-checked': {
                color: theme => alpha(theme.palette[color]?.light || theme.palette.primary.light, 0.9),
                '&:hover': {
                    backgroundColor: theme =>
                        alpha(theme.palette[color]?.light || theme.palette.primary.light, 0.12),
                },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                background: theme => `linear-gradient(135deg, 
                    ${theme.palette[color]?.main || theme.palette.primary.main},
                    ${theme.palette[color]?.dark || theme.palette.primary.dark}
                )`,
                opacity: 0.9,
            },
            transform: isMobile ? "scale(1.5)" : "scale(1.1)",
            transition: 'transform 0.3s ease',
        },

        switchLabel: {
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 2 : 1,
            transition: 'opacity 0.2s ease',
            '&:hover': {
                opacity: 0.9,
            }
        }
    }), [color, isMobile, theme])
}
