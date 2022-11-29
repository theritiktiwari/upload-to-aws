import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reset = () => {
    document.title = 'Reset Password';
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    const tst = (msg, type) => {
        const data = {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }
        if (type == "success") {
            toast.success(`${msg}`, data);
        } else {
            toast.error(`${msg}`, data);
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "email")
            setEmail(e.target.value);
    }

    const handleSubmit = (e) => {

    }
    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="back-to-home">
                <Link href={"/"}>← Home</Link>
            </div>
            <section className="auth d-flex justify-content-center align-items-center" style={{ height: "100vh", width: "100vw" }}>
                <form onSubmit={handleSubmit} method="POST" className='pt-3 px-5 pb-5'>
                    <h5 className="mb-4 pt-3 text-uppercase">Reset Password</h5>
                    <div className="mb-3">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" value={email} onChange={handleChange} name="email" id="email" placeholder="name@example.com" />
                    </div>
                    <input type="submit" className="btn w-100 mt-2" disabled={loading ? true : false} value={loading ? "Processing" : "Reset Now"} />

                    <div className="d-flex justify-content-end align-items-center mt-3">
                        <Link to={"/login"} className='link'>Back to Login ?</Link>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Reset