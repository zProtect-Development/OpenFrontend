import './NavLinkBtn.css';
import { Link } from 'react-router-dom';

function NavLinkBtn(props) {
    return (
        <Link role='button' to={props.to} className='btn'>{props.children}</Link>
    )
}

export default NavLinkBtn;
