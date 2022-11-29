import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    document.title = 'Signup';
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [age, setAge] = useState("");
    const [city, setCity] = useState("");
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
        if (type === "success") {
            toast.success(`${msg}`, data);
        } else {
            toast.error(`${msg}`, data);
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "firstname")
            setFirstname(e.target.value);
        if (e.target.name === "lastname")
            setLastname(e.target.value);
        else if (e.target.name === "email")
            setEmail(e.target.value);
        else if (e.target.name === "password")
            setPassword(e.target.value);
        else if (e.target.name === "confirmPassword")
            setConfirmPassword(e.target.value);
        else if (e.target.name === "age")
            setAge(e.target.value);
        else if (e.target.name === "city")
            setCity(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (firstname && lastname && email && password && confirmPassword && age && city) {
            if (password === confirmPassword) {
                const res = await fetch(`${process.env.REACT_APP_WEBSITE_HOST}/api/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstname,
                        lastname,
                        email,
                        password,
                        age,
                        city,
                        url: `${process.env.REACT_APP_WEBSITE_HOST}/verify`
                    })
                });
                const data = await res.json();
                if (data.type === "success") {
                    tst(data.message, data.type);
                    setTimeout(() => {
                        navigate("/login");
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
                setFirstname('');
                setLastname('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAge('');
                setCity('');
            } else {
                tst("Password does not match", "error");
            }
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
                    <h5 className="mb-4 pt-3 text-uppercase">Signup</h5>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="firstname">First Name</label>
                            <input type="text" className="form-control" name="firstname" value={firstname} onChange={handleChange} id="firstname" placeholder="Enter your first name" />
                        </div>
                        <div className="col">
                            <label htmlFor="lastname">Last Name</label>
                            <input type="text" className="form-control" name="lastname" value={lastname} onChange={handleChange} id="lastname" placeholder="Enter your last name" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" name="email" value={email} onChange={handleChange} id="email" placeholder="name@example.com" />
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" value={password} onChange={handleChange} id="password" placeholder="Enter your password" />
                        </div>
                        <div className="col">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} onChange={handleChange} id="confirmPassword" placeholder="Confirm the password" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="age">Age</label>
                            <input type="number" min={1} max={100} className="form-control" name="age" value={age} onChange={handleChange} id="age" placeholder="Enter your age" />
                        </div>
                        <div className="col">
                            <label htmlFor="city">City</label>
                            <input type="text" className="form-control" name="city" value={city} onChange={handleChange} id="city" placeholder="Enter your city" />
                        </div>
                    </div>
                    <input type="submit" className="btn w-100 mt-2" disabled={loading ? true : false} value={loading ? "Signing up" : "Signup"} />

                    <div className="d-flex justify-content-end align-items-center mt-3">
                        <Link to={"/login"} className='link'>Already an account ?</Link>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Signup