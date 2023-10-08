export const Button = ({ style, text, disabled, onClick }) => {
    return (
        <button className={`rounded text-white 
        text-white bg-gradient-to-r hover:bg-gradient-to-br focus:ring-2 focus:outline-none
        font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2
        ${style}`}
            onClick={() => onClick()}
            disabled={disabled}
        >{text}</button>
    )
}




