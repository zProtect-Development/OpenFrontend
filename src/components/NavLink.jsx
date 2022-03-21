import './NavLink.css';
import { Link } from 'react-router-dom';

function NavLink(props) {
    return (
        <Link role='button' to={props.to} className='item'>{props.children}</Link>
    )
}

export default NavLink;
