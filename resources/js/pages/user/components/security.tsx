import { Link } from "@inertiajs/react";

export default function Security() {
    return (
        <div className="bg-dark rounded p-4 mb-4">
            <h3 className="mb-3">Security and privacy</h3>
            <div className="list-group list-group-flush bg-transparent">
                <Link href={route('user.profile.credentials')} className="list-group-item list-group-item-action bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <span className="me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                            </svg>
                        </span>
                        Change password
                    </div>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </span>
                </Link>
            </div>
        </div>
    )
}
