import AboutMe from "@/pages/AboutMe";
import Channels from "@/pages/Channels";
import Community from "@/pages/Community";
import Dashboard from "@/pages/Dashboard";
import Homepage from "@/pages/Homepage";
import NewEmail from "@/pages/NewEmail";
import NewPassword from "@/pages/NewPassword";
import Profile from "@/pages/Profile";
import ResetPassword from "@/pages/ResetPassword";
import Announcements from "@/pages/Announcements";
import Users from "@/pages/Users";
import { Navigate, Route } from "react-router-dom";


//Routes autorisées pour les anonymes
const anonymous = () => (
    <>
        <Route path="*" element={<Navigate to="/" replace />} /> {/*Redirection pour les routes non-autorisées & inconnue */}
        <Route path="/" element={<Homepage />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/community" element={<Community />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/newPassword" element={<NewPassword />} />
        <Route path="/newEmail" element={<NewEmail />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
    </>
)


const logged = () => (
    <>
        {anonymous()}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
    </>
)

const privilegedLogged = (canManageUsers: boolean, canManageAnnouncements: boolean) => (
    <>
        {logged()}
        {canManageUsers ? <Route path="/users" element={<Users />} /> : null}
        {canManageAnnouncements ? <Route path="/announcements" element={<Announcements />} /> : null}
    </>
)

export const getRoutes = (isLoggedIn: boolean, canManageUsers: boolean, canManageAnnouncements: boolean) => {
    if (!isLoggedIn) {
        return anonymous();
    }

    if (canManageUsers || canManageAnnouncements) {
        return privilegedLogged(canManageUsers, canManageAnnouncements);
    }

    return logged();
};
