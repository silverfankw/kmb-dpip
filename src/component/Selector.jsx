export const Selector = ({ onChange, optionRenderLogic }) => {
    return (
        <select
            // defaultValue="＜— 左邊輸入路線 然後此選單會出現選項"
            onChange={e => { onChange(e.target.value) }}
            className="
        bg-gray-50 border border-gray-300 
        text-gray-900 text-sm 
        ring-1 ring-inset ring-neutral-400 
        rounded-lg w-full p-2.5">
            <option value="">＜— 左邊輸入路線 然後此選單會出現選項</option>
            {optionRenderLogic && optionRenderLogic()}
        </select>
    )
}

// focus:ring-blue-500 focus:border-blue-500 block
//         w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
//         dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500