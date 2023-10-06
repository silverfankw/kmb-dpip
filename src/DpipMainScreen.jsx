import './App.css'

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({ stops, currentStopIndex }) => {
    return (
        <>
            <div className='dpip_monitor'>
                <div className='dpip_screen'>
                    <div className='dpip_main_top'>
                        TOP
                    </div>
                    <div className='dpip_main_bottom'>
                        BOTTOM
                    </div>
                    <div className='dpip_main_footer'>
                        FOOTER
                    </div>
                </div>
            </div>
        </>

    )
}