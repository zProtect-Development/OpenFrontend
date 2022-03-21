import { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { useNavigate } from 'react-router-dom';
import { firebaseConfig } from '../../config/common.json';
import './Dashboard.css';

function Dashboard(props) {
    const [hasLicense, setLicense] = useState(false);
    const [showWebObf, setWebObf] = useState(false);
    const [showJVMP, setJVMP] = useState(false);
    const [jarFile, setJarFile] = useState(null);
    const [configFile, setConfigFile] = useState(null);
    const [jarText, setJarText] = useState('No file selected');
    const [configText, setConfigText] = useState('No file selected');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const app = initializeApp(firebaseConfig);
    // eslint-disable-next-line no-unused-vars
    const analytics = getAnalytics(app);

    // Ensure user is logged in
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        // tmp testing stuff
        setLicense(true)
        if (user) {
            // code later
            
        } else {
            navigate('/auth?to=/dashboard');
        }
    });

    function toggleWebObf() {
        if (showWebObf) {
            setWebObf(false);
        } else {
            setWebObf(true);
        }
    }
    
    function checkMagicNumber(file, type) {
        return new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.onloadend = function(event) {
                const bytes = (new Uint8Array(event.target.result)).subarray(0, 4);
                let header = '';
                for (const byte of bytes) {
                    header += byte.toString(16);
                }
                resolve((type.includes(header)));
            }
            fileReader.readAsArrayBuffer(file);
        });
    }

    function handleJarUpload(event) {
        const file = event.target.files[0];
        setJarText('Analyzing...');
        // https://en.wikipedia.org/wiki/List_of_file_signatures
        checkMagicNumber(file, ['504b34']).then((res) => {
            // also check file type based on extension
            if (res && (file.type === 'application/java-archive')) {
                setJarFile(file);
                setJarText(file.name);
            } else {
                setJarFile(null);
                setJarText('Invalid file type!')
            }
        });
    }

    function handleConfigUpload(event) {
        const file = event.target.files[0];
        setConfigText('Analyzing...');
        if (file.type === 'application/json') {
            setConfigFile(file);
            setConfigText(file.name);
        } else {
            setConfigFile(null);
            setConfigText('Invalid file type!')
        }
        
    }

    function toggleJVMP() {
        if (showJVMP) {
            setJVMP(false);
        } else {
            setJVMP(true);
        }
    }

    return (
        <div className='dash-contain'>
            <div className={'dash' + (hasLicense ? ' dash-hide' : '')}>
                <div className='dash-text'>
                    <div className='dash-title'>You do not have a zProtect License</div>
                    <div className='dash-desc'>Please purchase a zProtect License in the pricing page.</div>
                </div>
            </div>
            <div className={'dash' + ((hasLicense && !showWebObf && !showJVMP) ? '' : ' dash-hide')}>
                <div className='dash-text'>
                    <div className='dash-title'>You have a zProtect License</div>
                    <div className='dash-desc'>Please choose an obfuscator type:</div>   
                </div>
                <div className='dash-horiz'>
                    <div className='btn btn-first' onClick={toggleWebObf}>zProtect</div>
                    <div className='btn' onClick={toggleJVMP}>JVMP</div>
                </div>
            </div>
            <div className={'dash' + (showWebObf ? '' : ' dash-hide')}>
                <div className='dash-text'>
                    <div className='dash-title'>zProtect Web</div>
                    <div className='dash-file-upload'>
                        <label htmlFor='jar' role='button' className='btn'>Upload Jar</label>
                        <div className='dash-text'>{jarText}</div>
                    </div>
                    <input type='file' accept='.jar' name='jar' id='jar' onChange={handleJarUpload} />
                    <div className='dash-file-upload'>
                        <label htmlFor='config' role='button' className='btn'>Upload Config</label>
                        <div className='dash-text'>{configText}</div>
                    </div>
                    <input type="file" accept='.json' name="config" id='config' onChange={handleConfigUpload} />
                    <div className='btn btn-first dash-action'>Obfuscate</div>
                    <div className='btn btn-first dash-action' onClick={toggleWebObf}>Back</div>
                    <div className={'dash-error-text' + (errorMessage ? '' : ' dash-hide')}>{errorMessage}</div>
                </div>
            </div>
            <div className={'dash' + (showJVMP ? '' : ' dash-hide')}>
                <div className='dash-text'>
                    <div className='dash-title'>Coming v3?</div>
                    <div className='btn btn-first dash-action' onClick={toggleJVMP}>Back</div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;