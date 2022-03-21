import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReCaptcha from 'react-google-recaptcha';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig, recaptchaSiteKey } from '../../config/common.json';
import './Auth.css';

function Auth(props) {
    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isError, setError] = useState(false);
    const [isSignup, setSignup] = useState(false);
    const [isVerifyEmail, setVerifyEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const passwordUiElement = useRef(null);
    const confirmPasswordUiElement = useRef(null);
    const recaptcha = useRef(null);

    const app = initializeApp(firebaseConfig);
    // eslint-disable-next-line no-unused-vars
    const analytics = getAnalytics(app);

    // Ensure user is logged in
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const to = searchParams.get('to');
            navigate(to ?? '/dashboard')
        }
    });

    function getErrorText(error) {
        const formatted = error.split('/')[1].split('-');
        const upper = formatted.map(word => {
            return word.charAt(0).toUpperCase() + word.substring(1);
        });
        const res = upper.join(' ');
        return res;
    }

    function defaultAuth(email, password, e) {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // Reset the form
                e.target.reset();
                // If email not verified send verification email
                if (user.emailVerified === false) {
                    sendEmailVerification(user)
                    .then(() => {
                        showVerifyEmail();
                    });
                } else {
                    const to = searchParams.get('to');
                    navigate(to ?? '/dashboard');
                }
            })
            .catch((error) => {
                setError(true);
                setErrorMessage(getErrorText(error.code));
            });
    }

    function defaultSignup(email, password, e) {
        const auth = getAuth();
        // Create the user
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Reset the form
                e.target.reset();
                // Send verification email
                sendEmailVerification(user)
                    .then(() => {
                        showVerifyEmail();
                    });
            })
            .catch((error) => {
                setError(true);
                setErrorMessage(getErrorText(error.code));
            });
    }

    async function handleSubmit(event) {
        // Get form data
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const input = {};

        // Parse entries
        for (let entry of formData.entries()) {
            input[entry[0]] = entry[1];
        }

        // ReCaptcha magic
        const captchaToken = await recaptcha.current.executeAsync();
        recaptcha.current.reset();
        console.log(captchaToken)

        // Determine action based on button
        const submitter = event.nativeEvent.submitter.name;
        switch (submitter) {
            case 'signup':
                defaultSignup(input.email, input.password, event);
                break;
            case 'login':
                defaultAuth(input.email, input.password, event);
                break;
            default:
                console.log(`[Login.jsx] Bad value "${submitter}" recieved by form submit`);
                break;
        }
    }

    function showVerifyEmail() {
        setVerifyEmail(true);
    }

    return (
        <div className='login-contain'>
            <div className='login'>
                <div className='login-content'>
                    <form className={'login-form' + (isVerifyEmail ? ' login-invisible' : '')} onSubmit={handleSubmit}>
                        <div className='login-title'>Authentication</div>
                        <input className='login-input' type='email' name='email' placeholder='Email' />
                        {/* Magic logic - don't question it */}
                        {/* eslint-disable-next-line no-useless-escape */}
                        <input className='login-input' ref={passwordUiElement} type='password' name='password' onInput={isSignup ? (() => { return confirmPasswordUiElement.current.pattern = passwordUiElement.current.value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")}) : null} placeholder='Password' />
                        {/* Sign up only */}
                        <input className={'login-input login-input-no-margin' + (isSignup ? '' : ' login-invisible')} ref={confirmPasswordUiElement} type='password' pattern='' name='confirm' placeholder='Confirm Password' required={isSignup ? true : false} />
                        <ReCaptcha ref={recaptcha} sitekey={recaptchaSiteKey} size='invisible' />
                        {/* Log in only */}
                        <div className={'login-btns' + (isSignup ? ' login-invisible' : '')}>
                            <input className='login-btn' onClick={() => {setSignup(true)}} type='button' name='signupui' value='Sign Up' />
                            or
                            <input className='login-btn' type='submit' name='login' value='Log In' />
                        </div>
                        {/* Sign up only */}
                        <div className={'login-btns' + (isSignup ? '' : ' login-invisible')}>
                            <input className='login-btn' onClick={() => {setSignup(false)}} type='button' name='loginui' value='Log In' />
                            or
                            <input className='login-btn' type='submit' name='signup' value='Sign Up' />
                        </div>
                        <div className={'login-error-text' + (isError ? '' : ' login-error-hidden')}>{errorMessage}</div>
                    </form>
                    <div className={'login-form' + (isVerifyEmail ? '' : ' login-invisible')}>
                        <div className='login-title'>Please verify your email!</div>
                        <div className='login-text'>Thank you for signing up. An email has been sent to your inbox. Please follow further instructions in the email to verify the ownership of the provided email address.</div>
                        <div className='login-btn'>Resend Email</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;
