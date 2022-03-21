import { useEffect, useState } from 'react';
import { useRemark } from 'react-remark';
import docsSrc from '../assets/docs.md';
import './Docs.css';

function Docs(props) {
    const [isLoaded, setLoaded] = useState(false);
    const [markdown, setMarkdown] = useRemark({
        rehypeReactOptions: {
            components: {
                p: (props) => <p className='docs-p' {...props} />,
                // eslint-disable-next-line jsx-a11y/heading-has-content
                h1: (props) => <div className='docs-title' {...props} />
            }
        }
    });

    useEffect(() => {
        setLoaded(false);
        fetch(docsSrc)
            .then(res => {
                return res.text();
            })
            .then(text => {
                setMarkdown(text);
                setLoaded(true);
            });
    }, [setMarkdown]);

    return (
        <div>
            <div className={'docs-contain' + (isLoaded ? '' : ' docs-hide')}>
                <div className='docs'>
                    <div className='docs-content'>
                        {markdown}
                    </div>
                </div>
            </div>
            <div className={'docs-load-contain' + (isLoaded ? ' docs-hide' : '')}>
                <div className='docs-load'>
                    <div className='docs-title'>Loading...</div>
                </div>
            </div>
        </div>
    )
}

export default Docs;