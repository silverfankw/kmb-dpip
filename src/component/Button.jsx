export const Button = ({ style, text, disabled, onClick }) => {
    return (
        <button className={`py-1 px-3 rounded text-white ${style}`}
            onClick={() => onClick()}
            disabled={disabled}
        >{text}</button>
    )
}