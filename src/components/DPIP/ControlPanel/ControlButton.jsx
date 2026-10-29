import Tooltip from '@mui/material/Tooltip'

export const ControlButton = ({
    icon, label, supportingText, accessibleLabel, tooltip, tone = 'neutral', tile = false,
    pressed, active = pressed, shortcut, shortcutLabel, disabled = false, ...props
}) => {
    const className = [
        'control-button',
        `control-button--${tone}`,
        tile && 'control-button--tile',
        !label && 'control-button--icon-only',
        active && 'control-button--active',
    ].filter(Boolean).join(' ')
    const description = tooltip || accessibleLabel || label

    return (
        <Tooltip
            arrow
            describeChild
            title={shortcutLabel ? `${description} · ${shortcutLabel}` : description}
            enterTouchDelay={350}
        >
            <span className="control-button-wrap">
                <button
                    {...props}
                    type="button"
                    className={className}
                    disabled={disabled}
                    aria-label={accessibleLabel || label}
                    aria-pressed={pressed}
                    aria-keyshortcuts={shortcut}
                >
                    <span className="control-button__icon" aria-hidden="true">{icon}</span>
                    {label && <span className="control-button__label">{label}</span>}
                    {supportingText && <span className="control-button__supporting-text">{supportingText}</span>}
                    {pressed !== undefined && <span className="control-button__indicator" aria-hidden="true" />}
                </button>
            </span>
        </Tooltip>
    )
}
