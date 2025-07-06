/* eslint-disable no-irregular-whitespace */
import { Box, Typography, Container } from "@mui/material"
import { styled } from "@mui/system"

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

export const Footer = () => (
    <StyledFooter component="footer">
        <Container maxWidth="xl">
            <div className="select-none max-md:hidden flex items-center justify-center">
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
            </div>

        </Container>
    </StyledFooter>
)