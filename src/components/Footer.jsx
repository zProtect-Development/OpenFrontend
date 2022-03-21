import Link from './NavLink';
import './Footer.css';

function Footer(props) {
    function reloadApp() {
        window.location.reload(true);
    }
    return (
        <div className='footer'>
            <div className='footer-links'>
                <Link to='/privacy'>Privacy</Link>
                <Link to='/terms'>Terms</Link>
                <a className='item' href='mailto:support@zprotect.dev'>Contact</a>
                <a className='item' href='//github.com/zProtect-Development'>Github</a>
                <a className='item' href='//discord.gg/nFXfqsxpU6'>Discord</a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className='item' href="#" onClick={reloadApp}>Reload App</a>
            </div>
            <div className='footer-copy'>
                <div>© {new Date().getFullYear()} zProtect Development</div>
                <div className='footer-small'>Made with ❤️ by Rattley</div>
            </div>
        </div>
    )
}

export default Footer;