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
        fontWeight: 700,
        letterSpacing: '0.006em',
        lineHeight: 1.12,
        whiteSpace: 'nowrap',
    }

    return {
        button: {
            margin: 0,
            width: '100%',
            minHeight: `${buttonHeight}px`,
            background: `linear-gradient(180deg,
                ${alpha(paletteColor.main, 0.96)},
                ${alpha(paletteColor.dark, 0.9)}
            )`,
            backdropFilter: 'blur(6px)',
            color: paletteColor.contrastText,
            borderRadius: isMobile ? '14px' : '12px',
            border: `1px solid ${alpha(paletteColor.main, 0.38)}`,
            boxShadow: `
                0 6px 18px ${alpha(paletteColor.main, 0.18)},
                0 2px 6px rgba(15, 23, 42, 0.18),
                inset 0 1px 0 rgba(255, 255, 255, 0.18)
            `,
            fontFamily: "Zen Kaku Gothic Antique",
            fontWeight: 700,
            fontSize: isMobile ? '0.95rem' : '0.9rem',
            px: isMobile ? 1.5 : 2,
            py: 0.5,
            textTransform: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, filter 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
            letterSpacing: '0.006em',
            filter: 'saturate(1.04)',

            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(120deg, rgba(255,255,255,0.18), rgba(255,255,255,0.03), rgba(255,255,255,0.08))',
                transform: 'translateX(-120%)',
                transition: 'transform 0.6s ease',
                zIndex: -1,
            },

            '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `
                    0 10px 24px ${alpha(paletteColor.main, 0.22)},
                    0 4px 12px rgba(15, 23, 42, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.22)
                `,
                border: `1px solid ${alpha(paletteColor.main, 0.54)}`,
                filter: 'saturate(1.08)',
                '&::before': {
                    transform: 'translateX(120%)',
                },
            },

            '&:focus-visible': {
                outline: 'none',
                boxShadow: `
                    0 0 0 2px ${alpha(paletteColor.main, 0.38)},
                    0 12px 24px ${alpha(paletteColor.main, 0.22)}
                `,
            },

            '&:active': {
                transform: 'translateY(0px) scale(0.995)',
                boxShadow: `
                    0 3px 8px rgba(15, 23, 42, 0.18),
                    inset 0 1px 2px rgba(15, 23, 42, 0.18)
                `,
            },

            '&.Mui-disabled': {
                background: 'linear-gradient(180deg, rgba(55, 58, 64, 0.84), rgba(31, 34, 39, 0.92))',
                backdropFilter: 'blur(3px)',
                color: 'rgba(255, 255, 255, 0.32)',
                border: '1px solid rgba(174, 181, 190, 0.16)',
                boxShadow: 'none',
                filter: 'grayscale(0.12)',
                pointerEvents: 'auto',
                cursor: 'not-allowed',
                transform: 'none',
                '&::before': {
                    transform: 'translateX(0%)',
                    opacity: 0,
                },
                '&:hover': {
                    transform: 'none',
                    boxShadow: 'none',
                    border: '1px solid rgba(174, 181, 190, 0.16)',
                    filter: 'grayscale(0.12)',
                    '&::before': {
                        transform: 'translateX(0%)',
                        opacity: 0,
                    },
                },
                '&:active': {
                    transform: 'none',
                    boxShadow: 'none',
                },
                '& *': {
                    cursor: 'not-allowed',
                },
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
