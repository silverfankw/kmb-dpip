export const noticeConfig = {
    handrail: {
        container: "@container w-full h-full row-span-99 col-span-2 flex flex-col items-center justify-center bg-amber-300",
        textZh: "text-[12cqw] mt-[-1cqw] tracking-wider font-bold text-[#262A33]",
        textEn: "text-[5.5cqw] mt-[-1.5cqw] tracking-tight font-bold text-[#262A33]",
        zh: "請緊握扶手",
        en: "Please hold the handrail",
    },
    mindDoor: {
        container: "@container w-full h-full flex flex-col gap-1 col-span-3 justify-center items-center text-center bg-[#FF0000]",
        textZh: "text-[10cqw] mt-[-1cqw] text-white font-bold",
        textEn: "text-[5cqw] mt-[-1.5cqw] text-white font-bold",
        zh: "車門正在關上",
        en: "Door Closing",
    },
}

export const getNoticeConfig = (type) => noticeConfig[type] ?? noticeConfig.handrail
