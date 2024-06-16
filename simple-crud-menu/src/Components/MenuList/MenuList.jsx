import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './MenuList.css';

const MenuList = ({ setCurrentItem }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [menuCount, setMenuCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    Appetizer: 0,
    'Main Course': 0,
    Dessert: 0,
    Beverage: 0
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menu'), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
      setFilteredItems(items);
      setMenuCount(items.length); // Update the menu count

      // Update the category counts
      const newCategoryCounts = {
        Appetizer: 0,
        'Main Course': 0,
        Dessert: 0,
        Beverage: 0
      };

      items.forEach(item => {
        if (newCategoryCounts[item.category] !== undefined) {
          newCategoryCounts[item.category]++;
        }
      });

      setCategoryCounts(newCategoryCounts);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (id) => {
    setEditingItemId(id);
  };

  const handleSave = async (id) => {
    const itemToEdit = menuItems.find(item => item.id === id);
    const itemRef = doc(db, 'menu', id);
    try {
      await updateDoc(itemRef, itemToEdit);
      setEditingItemId(null);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const itemToDelete = menuItems.find(item => item.id === id);
      await deleteDoc(doc(db, 'menu', id));

      const updatedMenuItems = menuItems.filter((item) => item.id !== id);
      setMenuItems(updatedMenuItems);
      setFilteredItems(updatedMenuItems);
      setMenuCount(updatedMenuItems.length); // Update the menu count correctly

      if (itemToDelete) {
        setCategoryCounts(prevCounts => ({
          ...prevCounts,
          [itemToDelete.category]: prevCounts[itemToDelete.category] - 1
        }));
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const filterByCategory = (category) => {
    if (category === "All") {
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
      await Promise.all(menuItems.map(async (item) => {
        await deleteDoc(doc(db, 'menu', item.id));
      }));
      setMenuItems([]);
      setFilteredItems([]);
      setMenuCount(0); // Reset the menu count
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

  const handleChange = (id, field, value) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  if (menuItems.length === 0) {
    return null; // Hide the MenuList if no items
  }

  return (
    <div className="menu-list-container">
      <div className="buttons-container">
        <Button onClick={() => filterByCategory("All")}>
          All <span className="menu-count">{menuCount}</span>
        </Button>
        <Button onClick={() => filterByCategory("Appetizer")}>
          Appetizers <span className="menu-count">{categoryCounts.Appetizer}</span>
        </Button>
        <Button onClick={() => filterByCategory("Main Course")}>
          Main Courses <span className="menu-count">{categoryCounts['Main Course']}</span>
        </Button>
        <Button onClick={() => filterByCategory("Dessert")}>
          Desserts <span className="menu-count">{categoryCounts.Dessert}</span>
        </Button>
        <Button onClick={() => filterByCategory("Beverage")}>
          Beverages <span className="menu-count">{categoryCounts.Beverage}</span>
        </Button>
        <Button onClick={handleDeleteAll}>Delete All</Button>
      </div>
      <div className="menu-item-container">
        {filteredItems.map((item) => (
          <div key={item.id} className="menu-item">
            {editingItemId === item.id ? (
              <div className="edit-fields">
                <TextField
                  label="Name"
                  value={item.name}
                  onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Category"
                  value={item.category}
                  onChange={(e) => handleChange(item.id, 'category', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Options"
                  value={item.options}
                  onChange={(e) => handleChange(item.id, 'options', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Price"
                  value={item.price}
                  onChange={(e) => handleChange(item.id, 'price', e.target.value)}
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Cost"
                  value={item.cost}
                  onChange={(e) => handleChange(item.id, 'cost', e.target.value)}
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Amount in stock"
                  value={item.stock}
                  onChange={(e) => handleChange(item.id, 'stock', e.target.value)}
                  type="number"
                  fullWidth
                />
              </div>
            ) : (
              <div className='menu-list'>
                <h3>{item.name}</h3>
                <p>Category: {item.category}</p>
                <p>Options: {item.options}</p>
                <p>Price: {item.price}</p>
                <p>Cost: {item.cost}</p>
                <p>Amount in stock: {item.stock}</p>
              </div>
            )}
            <div className="item-buttons">
              {editingItemId === item.id ? (
                <Button onClick={() => handleSave(item.id)}>OK</Button>
              ) : (
                <Button onClick={() => handleEdit(item.id)}>Edit</Button>
              )}
              <IconButton
                style={{ position: 'absolute', top: 5, right: 5, color: 'white', background: '#ff4141' }}
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
        <DialogTitle id="alert-dialog-title">{"Confirm Delete All"}</DialogTitle>
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
