export const MindDoorNotice = ({ containerOverrideStyle, zhNameOverrideStyle, enNameOverrideStyle }) => (
    <div className={`w-full flex flex-col col-span-3
    justify-center item-center text-center bg-[#FF0000] ${containerOverrideStyle}`}>

        <div className={`max-md:text-[3.25rem] 
        md:max-lg:text-[4.5rem] text-[4.5rem] 
        text-white ${zhNameOverrideStyle}`}>
            車門正在關上
        </div>
        <div className={`mt-[-0.5rem] max-md:text-[1.75rem] text-[2.5rem] text-white ${enNameOverrideStyle}`}>
            Door Closing
        </div>
    </div>
)