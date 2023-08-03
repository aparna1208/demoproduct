import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import AXIOS from 'axios';
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table'; 
export default function  Viewproduct(){

  const fetchProducts = () => {
    AXIOS.get('http://localhost:9000/getproduct')
      .then((response) => {
        setuser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

    const[user,setuser]=useState([])
    useEffect(() => {
        // Immediately-invoked function expression (IIFE) to handle async behavior
        (async () => {
          try {
            const response = await AXIOS.get("http://localhost:9000/viewproduct");
            setuser(response.data.result);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        })();
      }, []);

      const handleDelete = (productId) => {
        AXIOS.delete(`http://localhost:9000/deleteproduct/${productId}`)
          .then(() => {
            fetchProducts();
          })
          .catch((error) => {
            console.error(error);
          });
      };

    return(
        <>
        <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Fileurl</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {
        
    user.map(
        (ls)=>{
            return(<tr>
                <td>{ls.pname}</td>
                <td>{ls.category}</td>
                <td>{ls.price}</td>
                <td>{ls.stock}</td>
                <td>
                {ls.fileurl && (
                  <img
                    src={`http://localhost:9000/${ls.fileurl}`}
                    alt={ls.pname}
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
                </td>
                <td>
              <Button
                  type="button"
                  variant="primary"
                  className="btn btn-danger mt-3"
                  onClick={() => handleDelete(ls._id)}
                >
                  Delete
                </Button>
                </td>
            </tr>)
        }
    )
}
        
        </tbody>
        </Table>
        </>
)
}




