import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Home.css';
// import logo from '../assets/logo.png';

function Home(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const logo = 'https://media.it-snek.com/storage/uploads/2022/01/31/zProtect_uid_61f7da42546d8.png';
    const to = searchParams.get('page');

    useEffect(() => {
        if (to) {
            navigate(to);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [to]);

    return (
        <div>
            <div className='home-contain'>
                <div className='home'>
                    <div className='home-content'>
                        <img className='home-content-image' src={logo} alt='zProtect Logo' />
                        <div className='home-content-title'>zProtect</div>
                        <div className='home-content-desc'>A fast, modern, and easy to use to java bytecode obfuscator with support for many java versions and Kotlin.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
