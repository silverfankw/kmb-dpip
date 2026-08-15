import { Dialog, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { useSelector } from 'react-redux'

import { getVersionHistoryDialogConfig } from './sharedComponentConfig'

export const VersionHistoryDialog = ({ open, onConfirm, versionHistory = [] }) => {
    const { language } = useSelector(state => state.userPreference)
    const config = getVersionHistoryDialogConfig(language)

    return (
        <Dialog
            sx={{ backdropFilter: 'blur(5px) sepia(5%)' }}
            open={open}
            onClose={onConfirm}
            PaperProps={{
                sx: {
                    bgcolor: '#0b1220',
                    color: '#ffffff',
                    minWidth: 280,
                    width: { xs: '92vw', sm: '80vw', md: '60vw' },
                    maxWidth: '960px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: 4,
                },
            }}
        >
            <DialogContent sx={{ maxHeight: { xs: '80vh', sm: '60vh', md: '50vh' }, overflowY: 'auto', pb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'inherit' }}>
                    {config.title}
                </Typography>
                <hr />
                {versionHistory.length > 0 ? (
                    <List disablePadding>
                        {versionHistory.map((entry, index) => (
                            <div key={`${entry.version}-${index}`}>
                                <ListItem alignItems="flex-start" disableGutters>
                                    <ListItemText
                                        primary={(() => {
                                            const isBigVersion = (ver) => /^(\d+)\.(0|1)$/.test(ver)
                                            const primaryText = `v${entry.version} · ${entry.date}`
                                            if (isBigVersion(entry.version)) {
                                                return (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                                        <StarIcon sx={{ color: '#FFD54F', fontSize: 18 }} />
                                                        {primaryText}
                                                    </span>
                                                )
                                            }
                                            return primaryText
                                        })()}
                                        primaryTypographyProps={{ sx: { color: 'inherit', fontWeight: 600 } }}
                                        secondary={entry.notes}
                                        secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.85)' } }}
                                    />
                                </ListItem>
                                {index < versionHistory.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />}
                            </div>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        {config.empty}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.04)', bgcolor: 'transparent' }}>
                <Button onClick={onConfirm} color="error" variant="contained">
                    {config.cancel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
