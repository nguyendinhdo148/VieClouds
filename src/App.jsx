import { BrowserRouter, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyFiles from "./pages/MyFiles";
import Subscription from "./pages/Subscription";
import Transactions from "./pages/Transactions";
import { Routes } from "react-router-dom";
import { RedirectToSignIn, SignedIn, SignedOut} from "@clerk/clerk-react";
import {Toaster} from "react-hot-toast";
import FileView from "./pages/FileView.jsx";
import {UserCreditsProvider} from "./context/UserCreditsContext.jsx";
const App = () => {
    return (
        <UserCreditsProvider>
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path="/file/:fileId" element={<FileView />} />
                <Route path="/" element={<Landing />} />
                <Route path="/Dashboard" element={
                    <>
                        <SignedIn><Dashboard /></SignedIn>
                        <SignedOut><RedirectToSignIn /></SignedOut>
                    </>
                } />
                <Route path="/Upload" element={
                    <>
                        <SignedIn><Upload/></SignedIn>
                        <SignedOut><RedirectToSignIn/></SignedOut>
                    </>
                } />
                <Route path="/My-Files" element={
                    <>
                        <SignedIn><MyFiles/></SignedIn>
                        <SignedOut><RedirectToSignIn/></SignedOut>
                    </>
                } />
                <Route path="/subscriptions" element={
                    <>
                        <SignedIn><Subscription/></SignedIn>
                        <SignedOut><RedirectToSignIn/></SignedOut>
                    </>
                } />
                <Route path="/transactions" element={
                    <>
                        <SignedIn><Transactions/></SignedIn>
                        <SignedOut><RedirectToSignIn/></SignedOut>
                    </>
                } />
                <Route path="/*" element={<RedirectToSignIn/>}/>
            </Routes>
        </BrowserRouter>
        </UserCreditsProvider>
    );
};


export default App;
