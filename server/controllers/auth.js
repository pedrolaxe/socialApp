const _ = require("lodash");
const { sendEmail } = require("../helpers");

const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');

const User = require('../models/user');


exports.signup = async (req, res) => {

    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(403).json({
        error: "Email already taken!"
    });
    let user = await new User(req.body);
    console.log(req.body);
    console.log(user);
    //default profile pic
    const base64Data = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEAAQADASIAAhEBAxEB/8QAHQABAQACAwEBAQAAAAAAAAAAAAgGBwIEBQkDAf/EAEEQAAEDAwEEBQkGBAUFAAAAAAABAgMEBREGByFBUQgSMWFxExQYIoGRlKHSFTJCUoKiM2KSsSM0Y3LBJLLR8PH/xAAcAQEAAgIDAQAAAAAAAAAAAAAABgcCBQMECAH/xAA1EQACAQICBggFBAMBAAAAAAAAAQIDBAURITFRYZGhBhITFUFxgeEWYrHB0SIyovAjQlKS/9oADAMBAAIRAxEAPwD6pgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHRvN8oNPUElbcquKipY/vSyuwngnNe5N59SbeSMZSjCLlJ5JHeOEsrII3SSPbHG1Mq564RPFSfNbdJ2R6yU2mKNI2708+rG5Ve9sfYni7PgaZv+rbzqmfyt2uVRXOzlGyv9Rv8Atb2J7EN1QwqtU01H1VzIHf8ATGytm4W6dR8Fx8fRZbyvbrtc0dZnObU6gpFc3tbA5ZlTu9RFMen6R2i4lXq1FXN3spnJn34JMBs44RQX7m2RGr02v5P/ABwil5N/f7FZw9I7Rcqp1qirh730zlx7smQ2ra5o68ua2m1BSI53Y2dywqvd66IRWBLCKD/a2hS6bX8X/khFrya+/wBj6ARSsnjbJG9skbkyjmLlF8FOZCen9W3nSs/lbTcqihdnKtif6jv9zexfahubRPSdkY6Om1PSJI3cnn1I3Cp3uj7F8W48DWV8KrU9NN9ZcyXWHTGyuWoXCdN8Vx8PVZbyhgdGzXyg1DQR1ttq4q2lk+7LE7KeC8l7l3neNK008mTyMozipReaYAB8MgAAAAAAAAAAAAAAAAAAAAAAAAAYttG17R7PdOS3GoRJahy+TpqbOFlk5eCdqry71QzhCVSShFZtnBXr07alKtVeUYrNs6+0jabbNnNs8rUqlRcJUXzeiY7DnrzX8re/3ZJN1lrm767ua1t1qVkxlIoGbooU5Nbw8e1eKnR1DqGu1TeKi53KdZ6ud2XOXsRODUTgidiIeaTWzsYWsc3plt/BQmOY/Xxao4RfVpLUtu97+S5gAGzIoAAAAAAAAAZBozXN30Jc0rbVULHnCSwP3xTJyc3/AJ7U4KVls32m2zaNbPK0ypT3CJE84onuy5i80/M3v9+CLT0tPahr9LXinudtnWCrgdlrk7FTi1U4ovYqGsvLGF1HNaJbfySvA8fr4TUUJPrUnrWzet/J8y8QYts517R7QtORXGnRIqhq+TqabOVik5d6L2ovLvRTKSFThKnJwksmi+6Fenc0o1qTzjJZpgAGBzgAAAAAAAAAAAAAAAAAAAAHCaaOnhklle2OKNque9y4RqJvVVIx2ra+l2garnrGuclvgzDRxLuxGi/exzd2r7E4G+ukZrB2ntFttsD+rVXVywqqLvSJN8nvy1vg5SUyUYTbpRdeXjoRUXTPE3KpHD6b0LTLz8F6LT6rYAASMq8AAAAAAAAAAAAAAAzLZTr6XZ/quCrc5y26fENZEm/Mar97HNvantTiWdDNHUQsliekkUjUc17VyjkXeiofP8qzo56wdqHRbrbO/rVVqckKKq71iXfH7sOb4NQjmLW6cVXj4aGWh0MxNxqSw+o9D0x8/Feq0+j2m1wARct0AAAAAAAAAAAAAAAAAAAAAkzpFX9bvtGnpWv60NuhZTtROzrKnXcvjl2P0mrz2NZXD7W1deqzOUnrZpE8FeuPkeOWHbw7OlGGxHmPErh3V5Vrv/aT4Z6OQAB2DXAAAAAAAAAAAAAAAA2h0dL+to2jQUrn9WG4wvp3IvZ1kTrtXxy3H6jV57OjLh9k6ustZnCQVsMi+CPTPyyde4p9rSlDajY4bcO1vKVZf6yXDPTyLqABXh6cAAAAAAAAAAAAAAAAAAAAAPn/ADvWSaRztznOVV8cnA719pHW++XGlemHQVEkSp3o5U/4OiWSnmk0eVZxcZOL1oAAyMAAAAAAAAAAAAAAAAc4HrHPG5u9zXIqeOTgd6xUbrhfLdSsTL56iOJE73ORP+TFvJZszhFykorWy9QAVseqgAAAAAAAAAAAAAAAAAAAACNtttlWx7TL0zGI6mRKti8/KJ1l/crk9hgpRPSj0qs1Ja9QwsysKrSVDkT8K5cxV7kXrJ+pCdie2VVVbeMvTgecsftHZYlWp5aG815PTy1egAB3iPgAAAAAAAAAAAAAAAzrYlZVvm0yysxmOmkWrevLyadZP3I1PaYKUT0XNKrDSXTUM0eFmVKSncqfhTDnqncq9VP0qdG9q9jbyl6cSQYBaO9xKjTy0J9Z+S089Xqb6ABAj0aAAAAAAAAAAAAAAAAAAAAAeZqawU2qbBXWmrTMFXEsarjKtXg5O9FwqeBEGobDV6YvdZa65nk6qlkWN6cF5OTuVMKncpeRqHb3ssdq22/bdshV93o2YkiYm+oiTgicXN7U5plORusNulQn2c/2y5MgnSvB5Yhbq5orOpDnHxXmta9SWgFTC4XcoJiUaAAAAAAAAAAAAAAiZXCb1APR09YavU97o7XQs8pU1UiRtTgnNy9yJlV7kLf0zYKbS1gobTSJiCkiSNFxhXLxcveq5VfE1rsE2WLpK2/bdzhVl3rGYZE9N9PEvDHBzu1eSYTmbdIdiV0q8+zg/wBK+peXRTB3YW7uayyqT5R8F5vW/QAA0pOwAAAAAAAAAAAAAAAAAAAAAAADRO2nYY65yVF/05Dmrdl9VQMT+KvF8afm5t48N+5Z0ex0b3Me1WPauFa5MKi8lPoCa52kbErPr1X1kS/Zl4VP81E3LZV4eUbx8U3+OMEgssS7NKnW1bStMe6KK5k7qw0SeuOpPetj5Pd4yEDKdZbM9Q6Gld9p0LvNs4bWQ+vC7l6ydnguF7jFiUQnGoutB5oqStQq203TrRcZLwayAAMzgAAAABlOjdmeodcyt+zKF3m2cOrJvUhbz9Ze3wTK9xhOcaa603kjno0KtzNU6MXKT8EszGGMdI9rGNV73LhGtTKqvIovYtsMdbJKe/6jhxVtw+loHp/CXg+RPzcm8OO/cmYbN9iVn0ErKyVftO8In+albhsS8fJt4eK7/DODYxF73Eu0Tp0dW0tvAeiitpK6v9MlqjrS3va+S3gAEfLLAAAAAAAAAAAAAAAAAAAAAAAAB/FXCZXch4urdZWrRFqdX3apSCLsZGm+SV35Wt4r8k44Je2j7brzrp8tLTuda7Ou5KWJ3rSp/qO4+CbvHtNha2VS6ecdC2kbxfHrXCI5VH1p+EVr9di/qTN2636QOndKPfTUare65q4dHTPRImL3yYVPci+wyDQ21Owa+galDVJDW4y+hqFRsreeE/Eneme/BFZyjkfDI2SNzmPauWuauFReaKb6WEUXDqxbz2+xXFPppfRuHUqRTh/zqy8nrz89G4v+SNk0bmSNa9jkw5rkyipyVDX+pdhGkNSPdJ5gtsnd2yW93kv24VvyNG6S6QuqNONZDWSMvdK3d1avPlETukTf/Vk2zYOktpe5ta24x1VolX7yvZ5WNPBzd/7UNTKzvLV508/T8Eyp47gmLwULnJPZNfR6uaZit16KkqPc6239jm/hjqqdUVPFzVXPuMen6MOrIlXqVVqmTh1Z3p/diFCW3aJpe7oi0t/t8ir+BahrXf0qqL8j3IaynqERYp45UXsVj0X+w7wvKeiXNB9GcEuv1Uf4yz+7Jfh6MOrJVTr1VqhTj1p3r/ZimQ2roqSq9rrlf2Nb+KOlp1VV8HOVMe43/NWU9OirLPHEidqveif3PDuW0TS9oRVqr/b41T8CVDXO/pRVX5DvG7qaI8kF0ZwS1/VVX/qWX3Rj+mthGkNNvbJ5gtznb2SXB3lf24RvyNgRxshjayNrWMamGtamEROSIalv/SW0vbGvbbo6q7yp91WM8lGvi52/9qmp9W9IXVGo2vho5GWSldu6tJnyip3yLv8A6cCNnd3TzqZ+v4FTHcEwiDhbZN7IL6vVzZQuudqdg0DC5K6qSatxllDTqjpXcsp+FO9cd2THtE9ILTuqnsp61Vsdc5cJHUvRYnL3Sbk96J7STpJHzSOkkc573LlznLlVXmqnE20cIoqHVk3nt9iGVOml9K47SnFKH/Ovi9eflktx9AkVFRFRcop/SQdnO2y9aEfFSzPdc7Om5aSZ3rRp/pu4eHZ4dpUOkNaWnXFqbX2qpSaPskidukid+VzeC/JeGTQ3VlVtXm9K2lj4Rj1ri8erB9WfjF6/Tav60j3QAa8koAAAAAAAAAAAAAAAAAAMP2k7S7ds5tPl6n/qK6ZFSmo2rh0i815NTip29f66odn+npblWKj5PuU9Oi4dNJwandxVeCEban1NcNX3moudymWapmX9LG8GtTgicjb2Fi7l9ef7VzIT0j6QLC4dhQ01ZfxW179i9Xv/AE1Xq66a0u8lxutQs8ztzGJuZE3g1qcE/wDVyp4wBMoxUEoxWSKMqVJ1pupUecnrbAAMjjAAAAAAAAAAAAAAAB7GltWXPRt2juNqqXQTt3Ob2skbxa5OKL/83njgxlFSXVks0clOpOlNVKbya1NFo7NNptu2j2pZYMU1whRPOaNy5Vi/mbzavP3mZEH6b1HX6TvFPc7bOsFVCuUXg5OLXJxReKFkbPNe0O0LT8dwpVSOduGVNMq5dDJy70XtReKd+UIdf2Ltn14ftfIvLo50gWKQ7Cvoqr+S2rftXqt2UAA05NwAAAAAAAAAAAAfjWVkNvpJqqplbDTwsWSSR64RrUTKqvsP2ND9JfXq0tJBpejlxJOiT1itXsZn1Ge1UyvgnM7NtQdxVVNGqxTEIYZaTuZ+GpbX4L++BqTajtBqNoepZKx3WjoIcx0kC/gZntX+Z3avsTghh4BPqcI04qEVoR5vuLipdVZV6zzlJ5sAA5DrgAAAAAAAAAAAAAAAAAAAAAyzZnr6p2ealir4+tJRyYjqqdF/iR54fzJ2p/4VTEwcc4RqRcJLQznoV6ltVjWpPKUXmmX3b6+nulDT1lLK2emnYkkcjexzVTKKdg0D0Z9fLKyfS1ZLlWIs9Erl4dr2J/3J+o38QK5oO3qum/6j0hhWIQxO0hcw8da2Na1+NwAB1TbAAAAAAAAAHVulxgs9tqq6pd1KemidNI7k1qZX+xDWqNQVGqtQ192qV/xquVZOrnPVT8LU7kTCewpTpJ6lWz6Gjt0T+rNc5kjXHb5NnrO+fUTwVSVyV4RR6tN1Xrej0Kb6a3zqXELOL0QWb83q4L6gAEgK2AAAAAAAAAAAAAAAAAAAAAAAAAAAPQ09e6jTd8obpSLiopJWyt37lwu9F7lTKL3KXNZbtBfrRR3Gld1qeqhbMxV7cOTOF7yCSoejNqVbpo6qtMr+tLbZvUReEUmXJ+5H/I0GL0etTVVa19GWP0Lv3Sup2cnoms15r8r6I3EACJlzAAAAAAAAAEs9Jm9rX68goGuzHQUrWq3k9/rKv9Ks9xqIyrancVuu0XUVRnKeeSRIvNGL1E+TUMVLBtYdnQhHceaMXru5xCvVfjJ8E8lyAAO0akAAAAAAAAAAAAAAAAAAAAAAAAAAAG1ejbe1tm0RKNzsR3CmkhwvZ1m+ui+5rk9pqoyLZ3cfsnXdgqs4aytiRy/yq5Ed8lU61zDtKM47UbTC67tb6jWXhJcM9PIuEAFenpkAAAAAAAAAgzUDpH3+5OmarJVqZVe13ajuuuUPPLF1TsR0rq26SXGqpZqerlXMr6WXqJIvNUwqZ707eJ43o06P53D4hPpJfDFaHVWaaZSVfobiPaycHFrPQ88vsSmCrPRp0fzuHxCfSPRp0fzuHxCfSZ97W+/gcHwbify8fYlMFWejTo/ncPiE+kejTo/ncPiE+kd7W+/gPg3E/l4+xKYKs9GnR/O4fEJ9I9GnR/O4fEJ9I72t9/AfBuJ/Lx9iUwVZ6NOj+dw+IT6R6NOj+dw+IT6R3tb7+A+DcT+Xj7Epgqz0adH87h8Qn0j0adH87h8Qn0jva338B8G4n8vH2JTBVno06P53D4hPpHo06P53D4hPpHe1vv4D4NxP5ePsSmCrPRp0fzuHxCfSPRp0fzuHxCfSO9rffwHwbify8fYlMFWejTo/ncPiE+kejTo/ncPiE+kd7W+/gPg3E/l4+xKYKs9GnR/O4fEJ9I9GnR/O4fEJ9I72t9/AfBuJ/Lx9iUwVZ6NOj+dw+IT6R6NOj+dw+IT6R3tb7+A+DcT+Xj7Epn70D5I66ndC1XytkarGt7VdnciFS+jTo/ncPiE+k9bTOwvSmlrpFcKelmqaqFetE6ql66Ru4ORMImfHODGWLW+TyTZy0uhmIua67iltz9jYIAIeXeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z';
    user.photo.data = Buffer.from(base64Data, 'base64');
    user.photo.contentType = 'image/jpg'
    user.username = user.name.replace(/\s/g, '').toLowerCase()

    await user.save();
    res.status(200).json({ message: "Signup success! Please Login. " });
};

exports.signin = (req, res) => {

    // find user by email
    const { email, password, notificationToken } = req.body;
    console.log(req.body);
    User.findOne({ email }, (err, user) => {
        // if error or no user found
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please signup. "
            });
        }
        // if user is found => match the password by userschema methods authenticate
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }

        if (notificationToken && notificationToken !== null) {
            User.findOneAndUpdate({ email: user.email }, { $set: { "notificationToken": notificationToken } }, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: "Some error occurred! Please try again later."
                    })
                }
            })
        }

        //generate token with user id and secret 
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        //return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name } });
    });
}

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.status(200).json({ message: "signout success! " })
}


exports.requireSignin = expressJwt({
    // if the token is valid, express jwt appends the verified users id
    // in an auth key to request object
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});


exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL
                }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL
                }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};


exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};

exports.socialLogin = (req, res) => {
    // try signup by finding user with req.email
    let user = User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
            // create a new user and login
            user = new User(req.body);
            req.profile = user;
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        } else {
            // update existing user with new social info and login
            req.profile = user;
            user = _.extend(user, req.body);
            user.updated = Date.now();
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        }
    });
};