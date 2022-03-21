import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { useNavigate } from 'react-router-dom';
import { firebaseConfig } from '../config/common.json';
import './Nav.css';

function Nav(props) {
    const navigate = useNavigate();
    // Scroll state
    const [scroll, setScroll] = useState(0);
    const [isAuth, setAuth] = useState(false);
    const [openDrawer, toggleDrawer] = useState(false);
    const drawerRef = useRef(null);
    const [titleText, setTitleText] = useState('zProtect');

    const app = initializeApp(firebaseConfig);
    // eslint-disable-next-line no-unused-vars
    const analytics = getAnalytics(app);

    // Ensure user is logged in
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setAuth(true);
        } else {
            setAuth(false);
        }
    });

    // Sign out logic
    function signout() {
        signOut(auth).then(() => {
            navigate('/auth');
        }).catch((error) => {
            alert(error.message);
        });
    }

    // Handle event subscription and easter egg ;)
    useEffect(() => {
        if ((Math.round(Math.random() * (101 - 1) + 1)) === 69) {
            setTitleText('zProsnek');
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('mousedown', handleCloseDrawer);
        return function cleanup() {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleCloseDrawer);
        }
    }, []);

    function handleCloseDrawer(event) {
        if (drawerRef.current && drawerRef.current.contains(event.target)) return;
        toggleDrawer(false);
    }

    // Update scroll position
    function handleScroll() {
        setScroll(window.scrollY);
    }

    // Determine classlist
    let classList = 'nav';
    if (scroll > 0) {
        classList += ' sticky'
    }

    return (
        <div className={classList}>
            <div className='container'>
                <div className='title'>{titleText}</div>
                <div className='nav-hamburger-button' onClick={toggleDrawer}>
                    <div className='nav-hamburger-lines' />
                </div>
                <div className='nav-container'>
                    <div className={'nav-list' + (openDrawer ? '' : ' nav-list-open' )} ref={drawerRef}>
                        {props.children}
                        <div className={'nav-list-group' + (openDrawer ? ' nav-list-column' : ' nav-list')}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a role='button' className={'btn' + (isAuth ? '' : ' nav-hide' )}>Settings</a>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a role='button' className={'btn' + (isAuth ? '' : ' nav-hide' )} onClick={signout}>Log Out</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav;
