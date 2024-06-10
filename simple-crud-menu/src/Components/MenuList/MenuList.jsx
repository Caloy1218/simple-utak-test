import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import './MenuList.css'; // Import your CSS file

const MenuList = ({ setCurrentItem }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'menu'));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setMenuItems(items);
      setFilteredItems(items); // Initialize filtered items with all items
    };
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setCurrentItem(item);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'menu', id));
      setMenuItems(menuItems.filter((item) => item.id !== id));
      setFilteredItems(filteredItems.filter((item) => item.id !== id));
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
    } catch (error) {
      console.error('Error deleting all documents: ', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="menu-list-container"> {/* Add a className */}
      <div>
        <Button onClick={() => filterByCategory("All")}>All</Button>
        <Button onClick={() => filterByCategory("Appetizer")}>Appetizers</Button>
        <Button onClick={() => filterByCategory("Main Course")}>Main Courses</Button>
        <Button onClick={() => filterByCategory("Dessert")}>Desserts</Button>
        <Button onClick={() => filterByCategory("Beverage")}>Beverages</Button>
        <Button onClick={handleDeleteAll}>Delete All</Button>
      </div>
      {filteredItems.map((item) => (
        <div key={item.id} className="menu-item"> {/* Add a className */}
          <h3>{item.name}</h3>
          <p>Category: {item.category}</p>
          <p>Options: {item.options}</p>
          <p>Price: {item.price}</p>
          <p>Cost: {item.cost}</p>
          <p>Amount in stock: {item.stock}</p>
          <Button onClick={() => handleEdit(item)}>Edit</Button>
          <Button onClick={() => handleDelete(item.id)}>Delete</Button>
        </div>
      ))}
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
