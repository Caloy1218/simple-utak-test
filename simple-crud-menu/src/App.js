import React, { useState } from 'react';
import './App.css';
import MenuItemForm from './Components/MenuItemForm/MenuItemForm';
import MenuList from './Components/MenuList/MenuList';

const App = () => {
  const [currentItem, setCurrentItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  return (
    <div>
      <MenuItemForm currentItem={currentItem} setCurrentItem={setCurrentItem} menuItems={menuItems} />
      <MenuList setCurrentItem={setCurrentItem} setMenuItems={setMenuItems} menuItems={menuItems} />
    </div>
  );
};

export default App;
