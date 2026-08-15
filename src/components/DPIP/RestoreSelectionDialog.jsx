import { Dialog, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { restoreSelectionDialogConfig, formatStoredRouteDetails, getRestoreSelectionDialogConfig } from './restoreSelectionDialogConfig'

export const RestoreSelectionDialog = ({ open, onConfirm, onDecline, storedData }) => {
    const { language } = useSelector(state => state.userPreference)
    const config = getRestoreSelectionDialogConfig(language)
    const details = formatStoredRouteDetails(storedData, language)

    return (
        <Dialog
            sx={{ backdropFilter: "blur(5px) sepia(5%)" }}
            open={open}
            onClose={onDecline}
        >
            <DialogContent>
                <Typography variant="body1">
                    {config.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {config.subtitle}
                </Typography>
                {storedData && (
                    <>
                        <Typography sx={{ mt: 2, mb: 1, p: 2, bgcolor: 'grey.300', borderRadius: 3 }}>
                            {details.map((line) => (
                                <span key={line}>
                                    • {line}
                                    <br />
                                </span>
                            ))}
                        </Typography>
                        <Typography variant="caption">
                            <span>
                                {config.recordedAtLabel} {new Date(storedData.timestamp)?.toString()}
                            </span>
                        </Typography>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onDecline} color="secondary">
                    {config.cancel}
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained">
                    {config.confirm}
                </Button>
            </DialogActions>
        </Dialog>
    )
}