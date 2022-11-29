import React from 'react';
import { Link } from "react-router-dom";

const Navbar = ({ websiteName, user }) => {

    const logout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">{websiteName}</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            {Object.keys(user).length === 0 && <li className="nav-item">
                                <Link to="/login" className="nav-link btn">Login</Link>
                            </li>}
                            {Object.keys(user).length !== 0 && <>
                                <li className="nav-item">
                                    <Link to="/upload" className="nav-link">Upload</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/image" className="nav-link">Check File</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-danger" onClick={logout}>Logout</button>
                                </li>
                            </>}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar