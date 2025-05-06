import { Link, usePage } from "@inertiajs/react";
import { type User } from '@/types';

const Account = () => {

    const { props } = usePage<{ auth: { user: User } }>();
    const user = props?.auth?.user;

    return (
        <div className="bg-dark rounded p-4 mb-4">
            <h3 className="mb-3">Account</h3>
            <div className="list-group list-group-flush bg-transparent">
                <Link href={route('user.profile.edit')} className="list-group-item list-group-item-action bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <span className="me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                        </span>
                        Edit profile
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
};

export default Account;
