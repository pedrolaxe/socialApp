import React from 'react';
import { Redirect } from 'react-router-dom';
import Posts from '../post/Posts';
import { isAuthenticated } from "../auth";

const Home = () => (
    <>
        
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
            
        

    </>
);

export default Home;