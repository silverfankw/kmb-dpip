/* eslint-disable no-irregular-whitespace */
import { Box, Typography, Container } from "@mui/material"
import { styled } from "@mui/system"

const StyledFooter = styled(Box)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(3),
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
}))

const FooterText = styled(Typography)(({ theme }) => ({
    fontSize: "0.75rem",
    color: "rgba(255,255,255, 0.3)",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
        fontSize: "0.8rem"
    },
    zIndex: -2,
}))

const messages = [
    "建議以16:9比例的電腦螢幕瀏覽本網站以達到最佳效果。",
    "Recommended to use a 16:9 aspect ratio desktop screen for the best experience."
]

export const Footer = () => (
    <StyledFooter component="footer">
        <Container maxWidth="xl">
            <div className="flex items-center justify-center gap-1 mb-2">
                {messages.map((message, index) => (
                    <FooterText key={index} variant="body2" gutterBottom component="span">
                        {message}
                    </FooterText>
                ))}
            </div>
            <div className="flex items-center justify-center gap-4 mb-2">
                <FooterText variant="body2" component="span">
                    silverfankw/kmb-dpip-v2 @ 2025
                </FooterText>
                <FooterText variant="body2" component="span">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400/75 underline"
                        href="https://github.com/silverfankw/kmb-dpip"
                    >
                        https://github.com/silverfankw/kmb-dpip
                    </a>
                </FooterText>
            </div>
        </Container>
    </StyledFooter>
)