import Pagination from "@/components/pagination"
import AppLayout from "@/layouts/app-layout"
import { User } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { FormEventHandler, useState } from "react"

type UserProps = {
    users: {
        data: User[],
        meta: {
            links: object
        },
    }
}

export default function UserIndex({ users }: UserProps) {

    const [user, setUser] = useState<User>();

    const handleBlock: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(user);
    }

    return (
        <>
            <Head title="User Management" />
            <AppLayout title="User Management" mainTitle={false}>
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Users</h2>

                            <span className="main__title-stat">{users.data.length} Total</span>

                            <div className="main__title-wrap">
                                <form action="#" className="main__title-form">
                                    <input type="text" placeholder="Find user.." />
                                    <button type="button">
                                        <i className="ti ti-search"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="catalog catalog--1">
                            <table className="catalog__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>BASIC INFO</th>
                                        <th>USERNAME</th>
                                        <th>PRICING PLAN</th>
                                        <th>STATUS</th>
                                        <th>CREATED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length > 0 ? users.data.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="catalog__text">{++index}</div>
                                        </td>
                                        <td>
                                            <div className="catalog__user">
                                                <div className="catalog__avatar">
                                                    <img src="/assets/backend/img/user.svg" alt="" />
                                                </div>
                                                <div className="catalog__meta">
                                                    <h3>{user.name}</h3>
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="catalog__text">{user.username}</div>
                                        </td>
                                        <td>
                                            <div className="catalog__text">
                                                {user.subscription.has_subscription ? user.subscription.plan_name : 'None'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`catalog__text catalog__text--${user.verified ? 'green' : 'red'}`}>{user.verified ? 'Approved' : 'Pending'}</div>
                                        </td>
                                        <td>
                                            <div className="catalog__text">{user.created_at}</div>
                                        </td>
                                        <td>
                                            <div className="catalog__btns">
                                                <button onClick={(e) => {
                                                    setUser(user);
                                                }} type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--banned" data-bs-target="#modal-status">
                                                    <i className="ti ti-lock"></i>
                                                </button>
                                                <Link href={route('system.user.show', user.uuid)} className="catalog__btn catalog__btn--edit">
                                                    <i className="ti ti-eye"></i>
                                                </Link>
                                                <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--delete" data-bs-target="#modal-delete">
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className='text-center'><div className="catalog__text text-center">No Records Found!</div></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        links={users.meta.links}
                        meta={users.meta}
                    />
                </div>
            </AppLayout>

            <div className="modal fade" id="modal-status" aria-labelledby="modal-status" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal__content">
                            <form onSubmit={handleBlock} className="modal__form">
                                <h4 className="modal__title">Status change</h4>

                                <p className="modal__text">Are you sure about blob change status?</p>

                                <div className="modal__btns">
                                    <button className="modal__btn modal__btn--apply" type="submit"><span>Apply</span></button>
                                    <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close"><span>Dismiss</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
