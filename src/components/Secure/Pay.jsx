import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { useNavigate } from 'react-router-dom';
import Select from 'react-dropdown-select';
import axios from 'axios';
import products from '../../config/products.json';
import { NPApiBase, NPToken, firebaseConfig } from '../../config/common.json';
import './Pay.css';

function Pay(props) {
    const logo = 'https://media.it-snek.com/storage/uploads/2022/01/31/zProtect_uid_61f7da42546d8.png';
    const [searchParams, setSearchParams] = useSearchParams();
    // eslint-disable-next-line no-unused-vars
    const [hasLicense, setLicense] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [cryptoList, setCryptoList] = useState([]);
    const [error, setError] = useState(null);
    const [cryptoPriceText, setCryptoPriceText] = useState('Please select a currency');
    const [cryptoType, setCryptoType] = useState(null);
    const [showPay, setShowPay] = useState(false);
    const [cryptoAddress, setCryptoAddress] = useState('Loading...');
    const [cryptoAmount, setCryptoAmount] = useState('Loading...');
    const [paymentStatus, setPaymentStatus] = useState('Loading...');
    const [cryptoCurrency, setCryptoCurrency] = useState('');
    const [purchaseId, setPurchaseId] = useState('');
    const navigate = useNavigate();
    const NPTime = 10000;
    const NPConfig = {
        headers: {
            'x-api-key': NPToken
        }
    }
    let NPTimer = null;

    const app = initializeApp(firebaseConfig);
    // eslint-disable-next-line no-unused-vars
    const analytics = getAnalytics(app);

    // Ensure user is logged in
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigate('/auth?to=/dashboard');
        }
    });

    const param = searchParams.get('item');
    let npi = searchParams.get('npi');
    const product = products[param];
    const total = Math.round(1.1 * product?.price);
    
    useEffect(() => {
        if (!product) {
            navigate('/dashboard');
        }
        // get np status
        axios.get(NPApiBase + '/status')
            .then(
                (res) => {
                    // errored
                    if (res.data.message !== 'OK') {
                        setLoaded(true);
                        setError('Payment Processor Error');
                    // ok
                    } else {
                        if (npi) {
                            getPrevPayment(npi)
                        } else {
                            axios.get(NPApiBase + '/currencies', NPConfig)
                                .then(
                                    // ok
                                    (res) => {
                                        const dat = res.data.currencies.map(e => {
                                            return { type: e.toUpperCase() };
                                        });
                                        setCryptoList(dat);
                                        setLoaded(true);
                                    },
                                    // errored
                                    (error) => {
                                        setLoaded(true);
                                        setError(error.message);
                                    }
                                );
                        }
                    }
                },
                // errored
                (error) => {
                    setLoaded(true);
                    setError(error.message);
                }
            );
        return () => {
            if (NPTimer !== null) clearInterval(NPTimer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getEstimatedPrice(selected) {
        if (!selected[0]?.type) {
            setCryptoPriceText('Please select a currency');
            setCryptoType(null);
            return;
        }
        setCryptoPriceText('Loading...');
        setCryptoType(selected[0]?.type);
        axios.get(NPApiBase + `/estimate?amount=${total}&currency_from=usd&currency_to=${selected[0]?.type}`, NPConfig)
            .then(
                (res) => {
                    setCryptoPriceText(`Estimated ${res.data.estimated_amount} ${selected[0]?.type}`);
                },
                (error) => {
                    setCryptoPriceText('GET Estimated Price Error');
                    console.log(error);
                }
            );
    }

    function payAction() {
        if (!cryptoType) return;
        setLoaded(false);
        const payData = {
            'price_amount': total,
            'price_currency': 'USD',
            'pay_currency': cryptoType,
            'order_description': product.name
        }
        axios.post(NPApiBase + '/payment', payData, NPConfig)
            .then(
                (res) => {
                    doPayUi(res);
                },
                (error) => {
                    setLoaded(true);
                    alert('An error occured:\n' + error)
                }
            );
    }

    function getPrevPayment(id) {
        axios.get(NPApiBase + '/payment/' + id, NPConfig)
            .then(
                (res) => {
                    doPayUi(res);
                },
                (error) => {
                    if (error.response.status === 404) return navigate('/pricing');
                    setLoaded(true);
                    alert('An error occured:\n' + error)
                }
            );
    }

    function doPayUi(res) {
        // show ui elements
        setLoaded(true);
        setShowPay(true);
        // edit search params
        setSearchParams({ item: param, npi: res.data.payment_id });
        // set npt
        npi = res.data.payment_id;
        // fill out data values
        setCryptoAmount(res.data.pay_amount);
        setCryptoCurrency(res.data.pay_currency.toUpperCase());
        setCryptoAddress(res.data.pay_address);
        setPaymentStatus(getPaymentStatus(res.data.payment_status));
        setPurchaseId(res.data.purchase_id);
        // set the NPTimer
        getNewValues(res.data.payment_id);
    }

    function getNewValues(id) {
        NPTimer = setInterval(() => {
            _getNewValues(id);
        }, NPTime);
    }

    function _getNewValues(id) {
        axios.get(NPApiBase + '/payment/' + id, NPConfig)
            .then(
                (res) => {
                    setCryptoAmount(res.data.pay_amount);
                    setPaymentStatus(getPaymentStatus(res.data.payment_status));
                },
                (error) => {
                    setCryptoAmount('Error!')
                    console.log(error);
                }
            );
    }

    function getPaymentStatus(paymentStatus) {
        switch (paymentStatus) {
            case 'waiting':
                return 'Waiting';
            case 'confirming':
                return 'Confirming';
            case 'confirmed':
                return 'Confirmed';
            case 'sending':
                return 'Sending';
            case 'partially_paid':
                return 'Partially Paid';
            case 'finished':
                return 'Finished';
            case 'failed':
                return 'Failed';
            case 'refunded':
                return 'Refunded';
            case 'expired':
                return 'Expired';
            default:
                return 'Error!';
        }
    }

    return (
        <div className='pay-contain'>
            <div className='pay'>
                <div className={(isLoaded && !showPay && !error) ? '' : 'pay-hide'}>
                    <div className='pay-detail'>
                        <img className='pay-image' src={logo} alt="zProtect logo" />
                        <div className='pay-content'>
                            <div className='pay-title'>{product?.name}</div>
                            <div className='pay-desc pay-desc-price'>${product?.price} + 10% VAT</div>
                            <div className='pay-dropdown-wrap'>
                                <Select 
                                    className='pay-dropdown'
                                    options={cryptoList}
                                    values={[]}
                                    labelField='type'
                                    valueField='type'
                                    searchBy='type'
                                    dropdownPosition='auto'
                                    loading={!isLoaded}
                                    onChange={getEstimatedPrice}
                                />
                            </div>
                            <div className='pay-text-small'>{cryptoPriceText}</div>
                            <input type="text" />
                            <div className='btn pay-btn' onClick={payAction}>Pay Now<div className='pay-text-darker'>via NowPayments</div></div>
                        </div>
                    </div>
                    <div className={'pay-text-large' + (hasLicense ? '' : ' pay-hide')}>
                        <div className='pay-title'>You already have a zProtect License</div>
                        <div className='pay-desc'>Please create another account to purchase another license. Trying to download? Go to the dashboard.</div>
                    </div>
                </div>
                <div className={(isLoaded && showPay && !error) ? '' : 'pay-hide'}>
                    <div className='pay-text'>
                        <div className='pay-title-large'>Send Payment</div>
                        <div className='pay-desc'>Please send</div>
                        <div className='pay-title-medium'>{cryptoAmount} {cryptoCurrency}</div>
                        <div className='pay-desc'>to the address below:</div>
                        <div className='pay-title-medium'>{cryptoAddress}</div>
                        <div className='pay-desc'>Current status:</div>
                        <div className='pay-title-medium'>{paymentStatus}</div>
                        <div className='pay-desc pay-desc-bottom'>Powered by NowPayments</div>
                        <div className='pay-desc'>Ref#{npi}/{purchaseId}</div>
                    </div>
                </div>
                <div className={isLoaded ? 'pay-hide' : ''}>
                    <div className='pay-title'>Loading...</div>
                </div>
                <div className={error ? '' : 'pay-hide'}>
                    <div className='pay-content'>
                        <div className='pay-title'>An Error Occured</div>
                        <div className='pay-desc'>{error}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pay;