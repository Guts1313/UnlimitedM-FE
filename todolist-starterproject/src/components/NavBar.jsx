import React from "react"
import styles from './NavBar.module.css'
import {NavLink} from "react-router-dom";

function NavBar() {

    const links = [
        {
            id: 1,
            path: "/",
            text: "Todo List"
        },
        {
            id: 2,
            path: "/users",
            text: "User"
        }
    ]

    return (
        <nav className={styles.navBar}>
            <ul>
                {links.map(link => {
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <NavLink to={link.path}>

                            {link.text}

                        </NavLink>
                    )
                })}
            </ul>
        </nav>
    )
}

export default NavBar;