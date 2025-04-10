export const HoldHandrailNotice = ({ containerStyle, zhNameStyle, enNameStyle }) =>
    <div className={`w-full row-span-99 col-span-2 
flex flex-col item-center justify-center text-center
 bg-amber-300 ${containerStyle}`}>
        <div className={`tracking-wider text-[5.5rem] font-[700]
    max-xs:text-[3.5rem] xs:max-sm:text-[3.75rem] sm:max-md:text-[4.5rem] 
    md:max-lg:text-[5.25rem] ${zhNameStyle}`}>請緊握扶手</div>
        <div className={`tracking-tight text-[2.5rem] font-[700]
    max-xs:text-[1.5rem] xs:max-sm:text-[1.75rem] sm:max-md:text-[2rem]
    md:max-lg:text-[2.25rem] ${enNameStyle}`}>Please hold the handrail</div>
    </div>