import { Dialog, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { restoreSelectionDialogConfig, formatStoredRouteDetails } from './restoreSelectionDialogConfig'

export const RestoreSelectionDialog = ({ open, onConfirm, onDecline, storedData }) => {
    const details = formatStoredRouteDetails(storedData)

    return (
        <Dialog
            sx={{ backdropFilter: "blur(5px) sepia(5%)" }}
            open={open}
            onClose={onDecline}
        >
            <DialogContent>
                <Typography variant="body1">
                    {restoreSelectionDialogConfig.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {restoreSelectionDialogConfig.subtitle}
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
                                {restoreSelectionDialogConfig.recordedAtLabel} {new Date(storedData.timestamp)?.toString()}
                            </span>
                        </Typography>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onDecline} color="secondary">
                    {restoreSelectionDialogConfig.cancel}
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained">
                    {restoreSelectionDialogConfig.confirm}
                </Button>
            </DialogActions>
        </Dialog>
    )
}