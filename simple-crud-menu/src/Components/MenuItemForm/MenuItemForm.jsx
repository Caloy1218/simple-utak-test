import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './MenuItemForm.css'; // Import your CSS file

const MenuItemForm = ({ currentItem, setCurrentItem }) => {
  const [name, setName] = useState(''); // Add state for the name
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name); // Set name state
      setCategory(currentItem.category);
      setOptions(currentItem.options);
      setPrice(currentItem.price);
      setCost(currentItem.cost);
      setStock(currentItem.stock);
    }
  }, [currentItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = { name, category, options, price, cost, stock }; // Include name in newItem

    try {
      if (currentItem?.id) {
        const itemRef = doc(db, 'menu', currentItem.id);
        await updateDoc(itemRef, newItem);
      } else {
        await addDoc(collection(db, 'menu'), newItem);
      }
      setCurrentItem(null);
      setName(''); // Clear name state
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
    <form onSubmit={handleSubmit} className="menu-item-form"> {/* Add a className */}
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required /> {/* Add TextField for Name */}
      <FormControl>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <MenuItem value="Appetizer">Appetizer</MenuItem>
          <MenuItem value="Main Course">Main Course</MenuItem>
          <MenuItem value="Dessert">Dessert</MenuItem>
          <MenuItem value="Beverage">Beverage</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Options" value={options} onChange={(e) => setOptions(e.target.value)} />
      <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" required />
      <TextField label="Cost" value={cost} onChange={(e) => setCost(e.target.value)} type="number" required />
      <TextField label="Amount in Stock" value={stock} onChange={(e) => setStock(e.target.value)} type="number" required />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default MenuItemForm;
