import Title from "@/components/decoration/Title";
import { AuthContext } from "@/shared/context/AuthContext";
import { useHttpClient } from "@/shared/hooks/http-hook";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NewEmail = () => {

    const [message, setMessage] = useState("Chargement...");
    const authCtx = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const navigate = useNavigate();

    const sendRefreshAuthData = async () => {
        await sendRequest({
            key: 3,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: 'GET',
            body: { action: "me" },
            onSuccess: (data) => {
                authCtx.setAuthData({
                    isLoggedIn: true,
                    id: data.user.id,
                    username: data.user.username,
                    email: data.user.email,
                    role: data.user.role,
                    created_at: data.user.created_at,
                });
            },
            onError: () => {
                authCtx.setAuthData({
                    isLoggedIn: false,
                    id: 0,
                    username: '',
                    email: '',
                    role: '',
                    created_at: '',
                });
            },
        });
    };

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        const action = new URLSearchParams(location.search).get('action');
        if (!token || !action) {
            navigate("/");
            return;
        }

        switch (action) {

            case "confirmEmailUpdate":
                sendRequest({
                    key: 3,
                    url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
                    method: 'POST',
                    body: { action: "confirmEmailUpdate", token: token },
                    onSuccess: (data) => {
                        setMessage(data.message);
                        sendRefreshAuthData();
                    },
                    onError: (error) => {
                        setMessage(error);
                    }
                })
                break;
            case "verifyEmail":
                sendRequest({
                    key: 3,
                    url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
                    method: 'POST',
                    body: { action: "verifyEmail", token: token },
                    onSuccess: (data) => {
                        setMessage(data.message);
                    },
                    onError: (error) => {
                        setMessage(error);
                    }
                })
                break;
            case "revokeRegister":
                sendRequest({
                    key: 3,
                    url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
                    method: 'POST',
                    body: { action: "revokeRegister", token: token },
                    onSuccess: (data) => {
                        setMessage(data.message);
                    },
                    onError: (error) => {
                        setMessage(error);
                    }
                })
                break;
            case "revokeEmailUpdate":
                sendRequest({
                    key: 3,
                    url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
                    method: 'POST',
                    body: { action: "revokeEmailUpdate", token: token },
                    onSuccess: (data) => {
                        setMessage(data.message);
                    },
                    onError: (error) => {
                        setMessage(error);
                    }
                })
                break;
            default:
                setMessage("Action inconnue.");
                break;
        }
    }, []);


    return (
        <>
            <Title title={message} size={1} />
        </>
    )
}


export default NewEmail;