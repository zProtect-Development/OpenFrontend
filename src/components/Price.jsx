import { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { useNavigate } from 'react-router-dom';
import products from '../config/products.json';
import { firebaseConfig } from '../config/common.json';
import './Price.css';

function Price(props) {
    const navigate = useNavigate();
    const [ isAuth, setAuth ] = useState(false);

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

    function doPurchase(type) {
        const item = products[type.target.id];
        if (!isAuth) {
            navigate(`/auth?to=/pay?item=${item.id}`)
        } else {
            navigate(`/pay?item=${item.id}`)
        }
    }

    return (
        <div className='price-contain'>
            <div className='price'>
                <div className='price-title'>Pricing</div>
                <div className='price-content'>
                    <div className='price-box'>
                        <div className='price-box-header'>
                            <div>
                                <div className='price-box-header-text'>Non-Commercial License</div>
                                <div className='price-box-header-small'>A private use zProtect license</div>
                            </div>
                            <div className='price-box-header-price'>$100</div>
                        </div>
                        <div className='price-box-lists'>
                            <ul className='price-box-list'>
                               <li>Lifetime updates</li>
                               <li>Obfuscation support</li>
                            </ul>
                            <ul className='price-box-list price-box-list-alt'>
                               <li>No commercial use</li>
                               <li>Can only be used by one person</li>
                            </ul>
                        </div>
                        <div className='price-btn-contain'>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className='btn price-btn' href='#' id='b2dfa180' onClick={doPurchase}>Buy Now</a>
                        </div>
                    </div>
                    <div className='price-box'>
                        <div className='price-box-header'>
                            <div>
                                <div className='price-box-header-text'>Commercial License</div>
                                <div className='price-box-header-small'>A public use zProtect license</div>
                            </div>
                            <div className='price-box-header-price'>$200</div>
                        </div>
                        <div className='price-box-lists'>
                            <ul className='price-box-list'>
                               <li>Lifetime updates</li>
                               <li>Obfuscation support</li>
                               <li>1 extra license for your commercial purposes</li>
                            </ul>
                            <ul className='price-box-list price-box-list-alt'>
                               <li>No specific tailoring</li>
                               <li>Can only be used by two people</li>
                            </ul>
                        </div>
                        <div className='price-btn-contain'>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className='btn price-btn' href='#' id='971d775b' onClick={doPurchase}>Buy Now</a>
                        </div>
                    </div>
                    <div className='price-box'>
                        <div className='price-box-header'>
                            <div>
                                <div className='price-box-header-text'>Enterprise</div>
                                <div className='price-box-header-small'>Contact zProtect support at sales@zprotect.dev for a quote</div>
                            </div>
                            <div className='price-box-header-price'>Custom</div>
                        </div>
                        <div className='price-box-lists'>
                            <ul className='price-box-list'>
                               <li>Specific tailoring for your various needs</li>
                               <li>Optional bulk licenses for your team</li>
                               <li>Direct support for the best possible integration in your environment</li>
                            </ul>
                        </div>
                        <div className='price-btn-contain'>
                            <a className='btn price-btn' href='mailto:sales@zprotect.dev'>Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Price;
