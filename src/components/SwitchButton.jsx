import FormControlLabel from '@mui/material/FormControlLabel'

export const SwitchButton = ({ sx, control, label }) => {
    return (
        <FormControlLabel
            sx={sx}
            control={control}
            label={label}
        />
    )
}