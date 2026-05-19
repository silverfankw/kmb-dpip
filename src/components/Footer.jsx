/* eslint-disable no-irregular-whitespace */
import { useState } from "react"
import { Box, Typography, Container } from "@mui/material"
import { styled } from "@mui/system"
import { VersionHistoryDialog } from "@components/VersionHistoryDialog"
import { versionHistory } from '@utils/versionHistory'


const styles = {
    versionHistoryBtn: [
        "text-[.75rem] text-gray-400/80 underline",
        "cursor-pointer",
    ].join(" "),
}

const StyledFooter = styled(Box)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(2),
}))

const FooterText = styled(Typography)(({ theme }) => ({
    fontSize: "0.75rem",
    color: "rgba(255,255,255, 0.5)",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
        fontSize: "0.75rem"
    },
}))

export const Footer = () => {
    const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)

    return (
        <>
            <StyledFooter component="footer">
                <Container maxWidth="xl">
                    <div className="select-none flex items-center justify-center gap-20 max-sm:gap-4">
                        <FooterText variant="body2" component="div">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400/80 underline"
                                href="https://github.com/silverfankw/kmb-dpip"
                            >
                                silverfankw/kmb-dpip-v2 @ 2025
                            </a>
                        </FooterText>
                        <FooterText variant="body2" component="div">
                            <p
                                className={styles.versionHistoryBtn}
                                onClick={() => setVersionHistoryOpen(true)}
                            >
                                Version History
                            </p>
                        </FooterText>
                    </div>
                </Container>
            </StyledFooter>
            <VersionHistoryDialog
                open={versionHistoryOpen}
                onConfirm={() => setVersionHistoryOpen(false)}
                versionHistory={versionHistory}
            />
        </>
    )
}