import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './MenuList.css';

const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];
const optionsList = ['Small', 'Medium', 'Large']; // Example options list

const MenuList = ({ setCurrentItem }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [menuCount, setMenuCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    Appetizer: 0,
    'Main Course': 0,
    Dessert: 0,
    Beverage: 0
  });
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menu'), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
      setFilteredItems(items);
      setMenuCount(items.length);

      const newCategoryCounts = {
        Appetizer: 0,
        'Main Course': 0,
        Dessert: 0,
        Beverage: 0
      };

      items.forEach((item) => {
        if (newCategoryCounts[item.category] !== undefined) {
          newCategoryCounts[item.category]++;
        }
      });

      setCategoryCounts(newCategoryCounts);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (id) => {
    const itemToEdit = menuItems.find((item) => item.id === id);
    setEditedItem(itemToEdit);
    setEditMode(true);
    setSelectedOption(itemToEdit.options); // Initialize selectedOption with current options
  };

  const handleSave = async () => {
    const { id, ...rest } = editedItem;
    const itemRef = doc(db, 'menu', id);
    try {
      await updateDoc(itemRef, rest);
      setEditMode(false);
      setEditedItem(null);
      setSelectedOption(''); // Clear selectedOption after save
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const itemToDelete = menuItems.find((item) => item.id === id);
      await deleteDoc(doc(db, 'menu', id));

      const updatedMenuItems = menuItems.filter((item) => item.id !== id);
      setMenuItems(updatedMenuItems);
      setFilteredItems(updatedMenuItems);
      setMenuCount(updatedMenuItems.length);

      if (itemToDelete) {
        setCategoryCounts((prevCounts) => ({
          ...prevCounts,
          [itemToDelete.category]: prevCounts[itemToDelete.category] - 1
        }));
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const filterByCategory = (category) => {
    if (category === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => item.category === category));
    }
  };

  const handleDeleteAll = () => {
    if (menuItems.length === 0) {
      alert('Nothing to delete here.');
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmDeleteAll = async () => {
    setOpenDialog(false);
    try {
      await Promise.all(
        menuItems.map(async (item) => {
          await deleteDoc(doc(db, 'menu', item.id));
        })
      );
      setMenuItems([]);
      setFilteredItems([]);
      setMenuCount(0);
      setCategoryCounts({
        Appetizer: 0,
        'Main Course': 0,
        Dessert: 0,
        Beverage: 0
      });
    } catch (error) {
      console.error('Error deleting all documents: ', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (field, value) => {
    if (field === 'options') {
      setSelectedOption(value);
    }
    setEditedItem((prevItem) => ({
      ...prevItem,
      [field]: value
    }));
  };

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <div className="menu-list-container">
      <div className="buttons-container">
        <Button onClick={() => filterByCategory('All')}>
          All <span className="menu-count">{menuCount}</span>
        </Button>
        {categories.map((category) => (
          <Button key={category} onClick={() => filterByCategory(category)}>
            {category}{' '}
            <span className="menu-count">{categoryCounts[category]}</span>
          </Button>
        ))}
        <Button onClick={handleDeleteAll}>Delete All</Button>
      </div>
      <div className="menu-item-container">
        {filteredItems.map((item) => (
          <div key={item.id} className="menu-item">
            {editMode && editedItem && editedItem.id === item.id ? (
              <div className="edit-fields">
                <TextField
                  label="Name"
                  value={editedItem.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel id={`category-label-${item.id}`}>
                    Category
                  </InputLabel>
                  <Select
                    labelId={`category-label-${item.id}`}
                    value={editedItem.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id={`options-label-${item.id}`}>Options</InputLabel>
                  <Select
                    labelId={`options-label-${item.id}`}
                    value={selectedOption}
                    onChange={(e) => handleChange('options', e.target.value)}
                  >
                    {optionsList.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Price"
                  value={editedItem.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Cost"
                  value={editedItem.cost}
                  onChange={(e) => handleChange('cost', e.target.value)}
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Amount in stock"
                  value={editedItem.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  type="number"
                  fullWidth
                />
              </div>
            ) : (
              <div className="menu-list">
                <h3>{item.name}</h3>
                <p>Category: {item.category}</p>
                <p>Options: {item.options}</p>
                <p>Price: {item.price}</p>
                <p>Cost: {item.cost}</p>
                <p>Amount in stock: {item.stock}</p>
              </div>
            )}
            <div className="item-buttons">
              {editMode && editedItem && editedItem.id === item.id ? (
                <Button onClick={handleSave}>Ok</Button>
              ) : (
                <Button onClick={() => handleEdit(item.id)}>Edit</Button>
              )}
              <IconButton
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  color: 'white',
                  background: '#ff4141'
                }}
                onClick={() => handleDelete(item.id)}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete All</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all menu items?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDeleteAll} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MenuList;
