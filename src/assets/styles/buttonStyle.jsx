import { useTheme, alpha } from '@mui/material/styles'
import { useWindowSize } from '@hooks'

export const useButtonStyles = (color) => {
    const theme = useTheme()
    const { isMobile, isTablet } = useWindowSize()
    const paletteColor = theme.palette[color] || theme.palette.primary
    const buttonHeight = isMobile ? 50 : isTablet ? 44 : 40
    const iconGap = isMobile ? 6 : 5
    const buttonTextStyle = {
        fontSize: isMobile ? "1.1rem" : "1rem",
        fontFamily: "Zen Kaku Gothic Antique",
        fontWeight: 600,
        letterSpacing: '0.01em',
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
    }

    return {
        button: {
            margin: 0,
            width: '100%',
            minHeight: `${buttonHeight}px`,
            background: `linear-gradient(135deg,
                ${alpha(paletteColor.main, 0.94)},
                ${alpha(paletteColor.dark, 0.88)}
            )`,
            backdropFilter: 'blur(10px)',
            color: paletteColor.contrastText,
            borderRadius: isMobile ? '14px' : '12px',
            border: `1px solid ${alpha(paletteColor.main, 0.34)}`,
            boxShadow: `
                0 8px 16px rgba(0, 0, 0, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.14)
            `,
            fontFamily: "Zen Kaku Gothic Antique",
            fontWeight: 600,
            fontSize: isMobile ? '0.95rem' : '0.9rem',
            px: isMobile ? 1.5 : 2,
            py: 0.5,
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
            letterSpacing: '0.01em',

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
                boxShadow: `
                    0 14px 30px ${alpha(paletteColor.main, 0.24)},
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
                border: `1px solid ${alpha(paletteColor.main, 0.52)}`,
                '&::before': {
                    transform: 'translateX(100%)',
                },
            },

            '&:focus-visible': {
                outline: 'none',
                boxShadow: `
                    0 0 0 2px ${alpha(paletteColor.main, 0.4)},
                    0 14px 30px ${alpha(paletteColor.main, 0.24)}
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
                border: '1px solid rgba(89, 85, 85, 0.24)',
                boxShadow: 'none',
                cursor: 'not-allowed',
            }
        },

        label: {
            ...buttonTextStyle,
        },

        labelWrapper: {
            display: "flex",
            alignItems: "center",
            gap: iconGap,
            position: 'relative',
            zIndex: 2,
        },

        buttonLabel: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            ...buttonTextStyle,
        },

        switch: {
            '& .MuiSwitch-switchBase.Mui-checked': {
                color: alpha(paletteColor.light, 0.92),
                '&:hover': {
                    backgroundColor: alpha(paletteColor.light, 0.12),
                },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                background: `linear-gradient(135deg,
                    ${paletteColor.main},
                    ${paletteColor.dark}
                )`,
                opacity: 0.9,
            },
            transform: isMobile ? "scale(1.02)" : "scale(0.9)",
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
    }
}
