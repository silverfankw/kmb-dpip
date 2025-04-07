import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react"


export const DpipNextStop = ({ stopZh, stopEn }) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [nameContainerWidth, setNameContainerWidth] = useState(0)
    const [zhTextWidth, setZhTextWidth] = useState(0)
    const [enTextWidth, setEnTextWidth] = useState(0)


    const handleWindowSizeChange = () => setWindowWidth(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => window.removeEventListener('resize', handleWindowSizeChange)
    }, [])

    // const nameContainerRef = useCallback(node => {
    //     if (node != null)
    //         setNameContainerWidth(node.getBoundingClientRect().width)
    // }, [])

    // const stopNameZhRef = useCallback(node => {
    //     if (node != null)
    //         setZhTextWidth(node.getBoundingClientRect().width)
    // }, [stopZh])

    // const stopNameEnRef = useCallback(node => {
    //     if (node != null)
    //         setEnTextWidth(node.getBoundingClientRect().width)
    // }, [stopEn])

    // const stopNameZhRef = useRef(null)
    // const stopNameEnRef = useRef(null)


    // useLayoutEffect(() => {
    //     setNameContainerWidth(stopNameZhRef.current.parentElement.offsetWidth)
    //     setZhTextWidth(stopNameZhRef.current.offsetWidth)
    //     setEnTextWidth(stopNameEnRef.current.offsetWidth)
    // }, [stopZh, stopEn])


    return (
        <>
            <div className="col-start-1 col-end-5 bg-[#eee8eba3]"></div>
            <div className={`flex flex-col items-center justify-center bg-[#FF0000]`}>
                <div className='inline-block rounded-[50%] bg-white w-[40px] h-[40px]'></div>
            </div>
            <div className={`relative flex flex-col bg-white`}>
                <div className="dpip-screen-next-stop-row">
                    <div className='next-stop-detail-zh'>
                        {stopZh ?? ""}
                    </div>
                    <div className='next-stop-detail-en'>
                        {stopEn ?? ""}
                    </div>
                </div>
            </div>
        </>
    )
}