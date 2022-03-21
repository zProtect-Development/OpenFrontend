import { useEffect, useState } from 'react';
import axios from 'axios';
import { contentNotFound } from '../config/common.json';
import './NotFound.css';

function NotFound(props) {
    const [msg, setMsg] = useState('');

    useEffect(() => {
        function _setMsg(data) {
            const items = data.map(e => { return e.message });
            const item = items[Math.floor(Math.random() * items.length)];
            setMsg(item);
        }

        axios.get(contentNotFound)
            .then(
                (res) => {
                    _setMsg(res.data.entries);
                },
                (error) => {
                    setMsg("Not found!");
                }
            );
    }, [])

    return (
        <div>
            <div className='nf-contain'>
                <div className='nf'>
                    <div className='nf-content'>
                        <div className='nf-text'>
                            <div className='nf-title'>Not Found</div>
                            <div className='nf-desc'>{msg}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound;