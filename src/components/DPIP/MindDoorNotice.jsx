export const MindDoorNotice = ({
    containerOverrideStyle = "",
    zhNameOverrideStyle = "",
    enNameOverrideStyle = ""
}) => {

    const styles = {
        noticeContainer: "@container w-full h-full flex flex-col gap-1 col-span-3 justify-center items-center text-center bg-[#FF0000]",
        textZh: "text-[10cqw] mt-[-1cqw] text-white font-[600]",
        textEn: "text-[5cqw] mt-[-1.5cqw] text-white font-[600]"
    }

    return (
        <div className={styles.noticeContainer + " " + containerOverrideStyle}>
            <div className={styles.textZh + " " + zhNameOverrideStyle}>
                車門正在關上
            </div>
            <div className={styles.textEn + " " + enNameOverrideStyle}>
                Door Closing
            </div>
        </div>
    )
}