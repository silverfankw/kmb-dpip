import { getNoticeConfig } from './noticeConfig'

export const MindDoorNotice = ({
    containerOverrideStyle = "",
    zhNameOverrideStyle = "",
    enNameOverrideStyle = ""
}) => {
    const config = getNoticeConfig('mindDoor')

    return (
        <div className={`${config.container} ${containerOverrideStyle}`}>
            <div className={`${config.textZh} ${zhNameOverrideStyle}`}>
                {config.zh}
            </div>
            <div className={`${config.textEn} ${enNameOverrideStyle}`}>
                {config.en}
            </div>
        </div>
    )
}