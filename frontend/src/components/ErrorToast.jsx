import { useEffect } from 'react'

export default function ErrorToast({ error, setError }) {

    // runs whenver error state gets updated
    useEffect(() => {
        if (error.show) {
            const toastError = document.getElementById('errorToast')
            const bootstrapToast = new window.bootstrap.Toast(toastError)
            bootstrapToast.show()
            setError((prev) => ({
                ...prev,
                show: false
            }))
        }
    }, [error.show])

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="errorToast" className="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header bg-danger text-white">
                    <strong className="me-auto">{error.title}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body text-white">
                    {error.msg}
                </div>

            </div>
        </div>
    )
}