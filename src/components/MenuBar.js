import React, { useContext, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
    
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  // const [activeItem, setActiveItem] = useState(path);

  // const handleItemClick = (e, { name }) => setActiveItem(name)

  const menuBar = user ? (
    <Menu id="navBar" pointing secondary size="massive" color="black" style={{marginTop: '5px'}}>
      <div
        floated='left'
        size='mini'
        className ="circular profilePicMenu"
        src=""
        style={{backgroundImage: `url(${user.picture})`}}
      />
      <Menu.Item
        name={user.firstname}
        // active
        as={Link}
        to="/"
      />
      <Menu.Menu position='right'>
        <Menu.Item
          // name='logout'
          icon="sign out"
          onClick={logout}
          as={Link}
          to="/login"
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="black">
    </Menu>
  )
  return menuBar
};

export default MenuBar;