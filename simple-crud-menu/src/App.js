import React, { useState } from 'react';
import './App.css';

import MenuItemForm from './Components/MenuItemForm/MenuItemForm';
import MenuList from './Components/MenuList/MenuList';

const App = () => {
  const [currentItem, setCurrentItem] = useState(null);

  return (
    <div>
      <h1>Restaurant Menu</h1>
      <MenuItemForm currentItem={currentItem} setCurrentItem={setCurrentItem} />
      <MenuList setCurrentItem={setCurrentItem} />
    </div>
  );
};

export default App;
