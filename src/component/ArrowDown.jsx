export const ArrowDown = ({ amount = 1 }) => {
    return (
        <>
            {
                [...Array(amount)].map((e, index) => {
                    return (
                        <div key={`down-arrow-group-${index}`} className='h-[8%]'>
                            <span key={`down-arrow-l${index}`} className="inline-block align-top w-[4px] h-[16px] bg-white m-[4px] 
                [&:nth-of-type(odd)]:-rotate-[60deg]"></span>
                            <span key={`down-arrow-r${index}`} className="inline-block align-top w-[4px] h-[16px] bg-white m-[4px]
                [&:nth-of-type(even)]:rotate-[60deg]"></span>
                        </div>
                    )
                })
            }
        </>

    )
}