  import React, { useState, useEffect } from 'react';
  import { db } from '../../firebase';
  import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
  import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
  import './MenuItemForm.css';

  const MenuItemForm = ({ currentItem, setCurrentItem, menuItems }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [options, setOptions] = useState('');
    const [price, setPrice] = useState('');
    const [cost, setCost] = useState('');
    const [stock, setStock] = useState('');
    const [height, setHeight] = useState('100vh');

    useEffect(() => {
      if (currentItem) {
        setName(currentItem.name);
        setCategory(currentItem.category);
        setOptions(currentItem.options);
        setPrice(currentItem.price);
        setCost(currentItem.cost);
        setStock(currentItem.stock);
      }
    }, [currentItem]);

    const handleScroll = (event) => {
      if (event.deltaY > 0) {
        setHeight('50vh');
      } else {
        setHeight('100vh');
      }
    };

    useEffect(() => {
      window.addEventListener('wheel', handleScroll);
      return () => {
        window.removeEventListener('wheel', handleScroll);
      };
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newItem = { name, category, options, price, cost, stock };

      try {
        if (currentItem?.id) {
          const itemRef = doc(db, 'menu', currentItem.id);
          await updateDoc(itemRef, newItem);
        } else {
          await addDoc(collection(db, 'menu'), newItem);
        }
        setCurrentItem(null);
        setName('');
        setCategory('');
        setOptions('');
        setPrice('');
        setCost('');
        setStock('');
      } catch (error) {
        console.error('Error adding/updating document: ', error);
      }
    };

    return (
      <div className="menu-itemForm-container" style={{ height }}>
        <div className="menu-title">
          <span className="menuTitle-top">Menu</span>
          <span className="menuTitle-btm">Tracker</span>
        </div>
        <form onSubmit={handleSubmit} className="menu-item-form">
          <div className="menu-textfield-container">
            <TextField
              className="menu-item-input"
              label="Name of Menu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3f3f3f' }
              }}
            />
            <FormControl
              className="menu-item-input"
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3f3f3f' }
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <MenuItem value="Appetizer">Appetizer</MenuItem>
                <MenuItem value="Main Course">Main Course</MenuItem>
                <MenuItem value="Dessert">Dessert</MenuItem>
                <MenuItem value="Beverage">Beverage</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              className="menu-item-input"
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3f3f3f' }
              }}
            >
              <InputLabel>Options</InputLabel>
              <Select value={options} onChange={(e) => setOptions(e.target.value)} required>
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </Select>
            </FormControl>
            <TextField
              className="menu-item-input"
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              required
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3f3f3f' }
              }}
            />
            <TextField
              className="menu-item-input"
              label="Cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              required
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3f3f3f' }
              }}
            />
            <TextField
              className="menu-item-input"
              label="Amount in Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              required
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3f3f3f' }
              }}
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </div>
    );
  };

  export default MenuItemForm;
