import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    document.title = 'Login';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        else if (e.target.name === "password")
            setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (email && password) {
            const res = await fetch(`${process.env.REACT_APP_WEBSITE_HOST}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            });
            const data = await res.json();
            if (data.type === "success") {
                tst(data.message, data.type);
                localStorage.setItem("user", JSON.stringify(data.data));
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                if (Array.isArray(data.message)) {
                    data.message.map((item) => {
                        tst(item.msg, data.type);
                    });
                } else {
                    tst(data.message, data.type);
                }
            }
            setEmail('');
            setPassword('');
        } else {
            tst("Please fill all the fields", "error");
        }
        setLoading(false);
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
                <Link to={"/"}>← Home</Link>
            </div>
            <section className="d-flex justify-content-center align-items-center" style={{ height: "100vh", width: "100vw" }}>
                <form onSubmit={handleSubmit} method="POST" className='pt-3 pb-5 px-5'>
                    <h5 className="mb-4 pt-3 text-uppercase">Login</h5>
                    <div className="mb-3">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" value={email} onChange={handleChange} name="email" id="email" placeholder="name@example.com" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" value={password} onChange={handleChange} name="password" id="password" placeholder="Password" />
                    </div>
                    <input type="submit" className="btn w-100 mt-2" disabled={loading ? true : false} value={loading ? "Logging in" : "Login"} />

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Link to={"/reset"} className="link">Forget password ?</Link>
                        <Link to={"/register"} className='link'>New User ?</Link>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Login;