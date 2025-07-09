import { Dialog, DialogContent, DialogActions, Button, Typography } from '@mui/material'

export const RestoreSelectionDialog = ({ open, onConfirm, onDecline, storedData }) => {

    return (
        <Dialog
            sx={{ backdropFilter: "blur(5px) sepia(5%)" }}
            open={open} onClose={onDecline}
        >
            <DialogContent>
                <Typography variant="body1">
                    檢測到上次瀏覽的路線，是否恢復先前進度？
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Previous route selection detected. Would you like to restore it?
                </Typography>
                {storedData && (
                    <>
                        <Typography sx={{ mt: 2, mb: 1, p: 2, bgcolor: 'grey.300', borderRadius: 3 }}>
                            • 路線: {storedData.route} {storedData.service_type != "1" && "特別班次"}
                            <br />
                            • 方向:  {storedData.orig_tc} → {storedData.dest_tc}
                            <br />
                            • 分站: {storedData.currentStop_tc} (第{storedData.currentStopIndex + 1}站)
                            <br />
                        </Typography>
                        <Typography variant="caption">
                            <span >最後記錄於 {new Date(storedData.timestamp)?.toString()}</span>
                        </Typography>
                    </>
                )}

            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onDecline} color="secondary">
                    否 No
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained">
                    是 Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}