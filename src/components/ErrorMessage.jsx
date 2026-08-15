import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

import { errorMessageConfig } from './sharedComponentConfig'

export const ErrorMessage = ({ error }) => {
    return (
        <div className="flex items-center justify-center p-4 w-full">
            <div className="flex items-center gap-4 bg-red-50 border-l-12 border-red-500 p-4 rounded-r shadow-lg max-w-2xl">
                <ErrorOutlineIcon className="text-red-500 text-3xl" />
                <div>
                    <p className="text-red-600">
                        {error || errorMessageConfig.fallback}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 text-sm text-red-700 hover:cursor-pointer hover:text-red-900 underline"
                    >
                        {errorMessageConfig.refresh}
                    </button>
                </div>
            </div>
        </div>
    )
}