import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Verify = () => {
    document.title = 'Verify Account';
    const [message, setmessage] = useState("");
    let { id } = useParams();
    const navigate = useNavigate();

    const code = id.split("&")[0].split("=")[1];
    const user_id = id.split("&")[1].split("=")[1];

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_WEBSITE_HOST}/api/verify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code,
                        user_id
                    })
                });
                const data = await res.json();
                let msg = "";
                if (data.type === "success")
                    msg = `Success! Your account has been <b>verified</b>. You can now login to your account.<br /> You will be redirected to the login page in 5 seconds.`;
                else
                    msg = `Error! ${data.message} <br /> You will be redirected to the login page in 5 seconds.`;
                setmessage(msg);
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            } catch (err) {
                // console.log(err);
            }
        }
        (code && user_id) && verify();
    }, []);

    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
                <div dangerouslySetInnerHTML={{ __html: message }} />
            </div>
        </>
    )
}

export default Verify