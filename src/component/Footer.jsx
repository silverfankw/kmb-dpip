import { Box, Typography, Container } from "@mui/material";
import { styled } from "@mui/system";

const StyledFooter = styled(Box)(({ theme }) => ({
    width: "100%",
    // backgroundColor: "#f5f5f5",
    padding: theme.spacing(3),
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0
}));

const FooterText = styled(Typography)(({ theme }) => ({
    fontSize: "0.75rem",
    color: "rgba(255,255,255, 0.3)",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
        fontSize: "0.8rem"
    }
}));

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <StyledFooter component="footer">
            <Container maxWidth="lg">
                <FooterText variant="body2" gutterBottom>
                    All of the above resources are merely for entertainment purposes. All rights reserved to The Kowloon Motor Bus Company (1933) Limited.
                </FooterText>
                <FooterText variant="body2" gutterBottom>
                    silverfankw/kmb-dpip v1.1@2025　https://github.com/silverfankw/kmb-dpip
                </FooterText>
            </Container>
        </StyledFooter>
    );
};

export default Footer;