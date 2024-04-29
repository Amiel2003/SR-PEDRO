import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './BranchDetails.css'
import './ProductDetails.css'
import BounceLoader from 'react-spinners/BarLoader'
import BarLoader from 'react-spinners/BarLoader';
import { UilPen, UilPlus, UilTrash, UilCheck, UilX } from "@iconscout/react-unicons";

function ProductDetails({ id }) {
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState('')
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [productDescription, setProductDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [editLoading, setEditLoading] = useState(false)

  const [isEditProductName, setIsEditProductName] = useState(false)
  const [isEditProductDescription, setIsEditDescription] = useState(false)
  const [isEditProductPrice, setIsEditProductPrice] = useState(false)

  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState(0)
  const [newProductDescription, setNewProductDescription] = useState('')

  const ProductURL = process.env.REACT_APP_PRODUCTS_URL + '/' + id;
  const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log(ProductURL)
    axios.get(ProductURL)
      .then((res) => {
        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.product, secretKey).toString(CryptoJS.enc.Utf8));
        console.log(decryptedData[0])
        setProductID(decryptedData[0]._id)
        setProductName(decryptedData[0].product_name)
        setProductPrice(decryptedData[0].price)
        setProductDescription(decryptedData[0].product_description)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error getting product by id: ', id)
      })
  };

  function handleEditChange(param, func, e) {
    e.preventDefault();
    switch (param) {
      case 'productName':
        (func === 'edit') ? setIsEditProductName(true) : (func === 'save') ? saveProduct(newProductName, 'product_name', setProductName, setIsEditProductName) : setIsEditProductName(false);
        break;
      default:
    }
  }

  function saveProduct(value, param, func, editFunc){
    console.log('sdfjhsdfjsdfj')
      try {
        setEditLoading(true)
        const json = {
          _id: productID,
          value: value,
          attribute: param,
        }
        axios.post("http://localhost:5000/products/edit/this", { data: json })
        .then((res) => {
          // if (res.data.status !== 200) {
          //   if (res.data.message === 'Email already in use') {
          //     setErrorMessage(res.data.message)
          //     setEditLoading(false)
          //   } else {
          //     editFunc(false)
          //     func(value)
          //     setEditLoading(false)
          //   }
          // } else {
          //   setErrorMessage(res.data.message)
          // }
        })
        .catch((error) => { console.error('Error updating product: ', error) })
      } catch (error) {
        console.error('Something went wrong while sending update data: ', error)
      }
  }

  function archiveProduct(id, e){
    e.preventDefault()
    try {
      axios.post("http://localhost:5000/products/archive",{id:id})
      .then((res) => {
        
      })
    } catch (error) {
      console.error('Error archiving employee')
    }
  }

  return (
    <div>
      <MuiButton
        variant="contained"
        color="primary"
        onClick={handleShow}
      >
        Details
      </MuiButton>


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName='modal-employee'
      >
        <Modal.Header closeButton>
          <Modal.Title>DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading === true ? (
            <BounceLoader
            cssOverride={override}
            color="blue" />
          ):(
             <div className="product-details-container">
            
            { isEditProductName === false ? (
              <div className='product-deets'>
              <div><h3 className="product-title">{productName}</h3></div>
              <div className='product-pen'><UilPen size='18' onClick={(e) => handleEditChange('productName', 'edit', e)}/></div>
            </div>
            ):(
              <div className='product-deets'>
                <div><input type="text" onChange={(e) => setNewProductName(e.target.value)} className='form-control edit-employee' placeholder='Product Name'/></div>
                {editLoading === false ? (
                                <div className='product-deets'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('productName', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('productName', 'save', e)} /></div>
                                </div>
                              ) : (
                                <div>
                                  <BarLoader width={'25px'} color='green' />
                                </div>
                              )}
              </div>
            )}
            <p className="product-description">{productDescription}</p>
            <h4 className="price">
              <span>₱{productPrice}</span>
            </h4>
            <h8 className="ID">
              <span className="ID">ID: {productID}</span>
            </h8>
            <div className="action">

            </div>
          </div>
          )}

<MuiButton
                    variant="contained"
                    color="error"
                    className='btn-edit'
                    onClick={(e) => archiveProduct(productID, e)}
                  >Archive Product
                  </MuiButton>
         

        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ProductDetails;