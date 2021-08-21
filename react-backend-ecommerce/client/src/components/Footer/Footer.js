import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Footer.scss';

const staticCategories = [
    { id: 'cuidado de la salud', name: 'Suv' },
    { id: 'cuidado personal', name: 'Pick Up' },
    { id: 'oferta', name: 'Van' }
  ];

function Footer() { 
    return (
    <footer>
        <nav className="footer-inner">
            <section className="footer-item">
            <Link to="/"><img style={{ width: 50, marginLeft: "53px" }} src="https://image.flaticon.com/icons/png/512/632/632690.png" alt="farmaceutica del sur" /></Link>
                <h2><b className="color">4x4 life </b>, Suv's and Pickup's.</h2>
            </section>

            <section className="footer-item">
                <h3>Explorar</h3>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    {staticCategories.map(cat =>
                        <li key={cat.id}>
                            <NavLink to={`/category/${cat.id}`} style={{textDecoration: "none"}} className="nav-link">{cat.name}</NavLink>
                    </li>)}
                </ul>
            </section>
          
            <section className="footer-item">
                <h3>Visitanos</h3>
                <Link to="">
                <p>-</p>
                <p>-</p>
                <p>-</p>
                </Link>
            </section>   

            <section className="footer-item">
                <h3>Seguinos</h3>
                <ul>
                    <li><Link to="">Instagram</Link></li>
                    <li><Link to="">Facebook</Link></li>
                </ul>
            </section>
        
            <section className="footer-item">
                <h3>Legal</h3>
                <ul>
                    <li><Link to="">Terminos</Link></li>
                    <li><Link to="">Privacidad</Link></li>
                </ul>
            </section>
          
            <section className="footer-item">
                <Link to="" className="footer-button">-</Link>
            </section>
          
            <section className="footer-item">
                <h3>Contactanos</h3>
                    <p className="desktop"><Link to="">-</Link></p>
                    <p className="mobile"><Link to="">Email us</Link></p>
                    <p><Link to="">+54 1595838925</Link></p>
            </section>
        </nav>
    </footer>);
 }

 export default Footer;

 