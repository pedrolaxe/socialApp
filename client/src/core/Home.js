import React from 'react';
import { Redirect } from 'react-router-dom';
import Posts from '../post/Posts';
import { isAuthenticated } from "../auth";
import Footer from './Footer';


const Home = () => (
    <>
        <div className="container">
        {isAuthenticated() && (
                <>
                    <Posts />
                </>
            )}
            {!isAuthenticated() && (
                <>
                   <Redirect to="/signin" />
                </>
            )}
            
        </div>
        {/* <footer className="page-footer font-small" style={{ background: "#3E4551" }}>
            <div className="container">
                <p className="text-center" style={{ color: "#fff", fontSize: "large", margin: "0", padding: "20px" }}>
                    SocialApp 2020
                </p>
            </div>
        </footer> */}

    </>
);

export default Home;