export const HoldHandrailNotice = ({
    containerOverrideStyle = "",
    zhNameOverrideStyle = "",
    enNameOverrideStyle = ""
}) => {

    const styleClasses = {
        noticeContainer: "@container w-full h-full row-span-99 col-span-2 flex flex-col items-center justify-center bg-amber-300",
        textZh: "text-[12cqw] mt-[-1cqw] tracking-wider font-[700]",
        textEn: "text-[5.5cqw] mt-[-1.5cqw] tracking-tight font-[700]"
    }

    return (
        <div className={styleClasses.noticeContainer + " " + containerOverrideStyle}>
            <div className={styleClasses.textZh + " " + zhNameOverrideStyle}>
                請緊握扶手
            </div>
            <div className={styleClasses.textEn + " " + enNameOverrideStyle}>
                Please hold the handrail
            </div>
        </div>
    )
}