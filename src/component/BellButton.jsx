import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StopButton = styled(Button)({
    textTransform: 'none',
    margin: ".25rem 0 .375rem 0",
    fontSize: 16,
    lineHeight: 1.5,
    backgroundColor: '#FF0000',
    boxShadow: "0 .25rem #A60707",
    color: "#FFFFFF",
    height: "4rem",
    '&:hover': {
        backgroundColor: '#CC0202',
        // boxShadow: 'none',
    },
    '&:active': {
        boxShadow: "0 .45rem #A60707",
        transform: "transformY(4px)",
        backgroundColor: '#FF0000',
        borderColor: '#FF0000',
    },
    // '&:focus': {
    //     boxShadow: '0 0 0 0.2rem rgba(255,0,0,.5)',
    // },
});

export const BellButton = ({ onClick }) => (
    <div className="rounded-lg w-[5rem] h-[12rem] 
					flex flex-col items-center justify-center bg-[#1f1c1c]">
        <span className="font-[400] text-2xl text-white">鐘</span>
        <StopButton onClick={onClick}>
            STOP
        </StopButton>
        <span className="font-[400] text-sm text-white">BELL</span>
    </div>
)