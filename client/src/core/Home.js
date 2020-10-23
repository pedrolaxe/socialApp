import React from 'react';
import { Redirect } from 'react-router-dom';
import Posts from '../post/Posts';
import { isAuthenticated } from "../auth";

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

    </>
);

export default Home;