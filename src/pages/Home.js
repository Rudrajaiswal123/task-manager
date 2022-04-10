import React, {useState, useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import {Form, Row, Col, Button, Table, OverlayTrigger, Tooltip, Modal, Dropdown, DropdownButton} from "react-bootstrap";
import {Pencil, Trash} from "react-bootstrap-icons";
import {doAjaxCall, formatDate} from "../util";


const Home = () => {
    const [taskData, setTaskData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterTaskData, setFilterTaskData] = useState([]);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [usersData, setUsersData] = useState([]);
    const [message, setMessage] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState(" Select Priority");
    const [assigned, setAssigned] = useState("Select assign");
    const [assignedId, setAssignedId] = useState("Select assign");
    const [taskid, setTaskid] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const history = useHistory();

    

   const getTaskData = () => {
          doAjaxCall(`list`, "GET").then((response) => {
            if (response.status === 200) {
              setTaskData(response.data.tasks);
              setFilterTaskData(response.data.tasks);
              console.log(response);
              setIsLoading(false);
            } else {
              alert("Failed");
            }
          });
      };

      const getUsersData = () => {
        doAjaxCall(`listusers`, "GET").then((response) => {
          if (response.status === 200) {
            setUsersData(response.data.users);
            console.log("users",response);
            setIsLoading(false);
          } else {
            alert("Failed");
          }
        });
    };

    useEffect(()=>{
      getTaskData();
      getUsersData();
    },[]);

    const handleCreate = () => {
      history.push('./create');
    }

      const onSubmit = () => {
        const formData = new FormData();
        formData.append("message", message);
        formData.append("due_date",dueDate);
        formData.append("assigned_to", assignedId);
        formData.append("taskid", taskid);
        if (priority === "Medium"){
          formData.append("priority", 2);  
          }
          else if(priority === "High"){
              formData.append("priority", 3);
          }
          else{
              formData.append("priority", 1);
          }
        
        doAjaxCall(`update`, "POST", formData )
        .then((response) => {
          if (response.status === 200) {
           handleClose();
           getTaskData();
            setIsLoading(false);
          } else {
            alert("Failed");
          }
        });
    };

      

      const handleUserInput= (filterText) => {
        setSearch(filterText);
        console.log("taskdata",taskData[0].assigned_name);
       let filterData = taskData.filter(task => (task?.message.toLowerCase().indexOf(filterText.toLowerCase()) !== -1))
        setFilterTaskData(filterData);
    };

    

    const deleteOrder =  (id) => {
      const formData = new FormData();
        formData.append("taskid", id);
      doAjaxCall(`delete`, "POST",formData)
        .then((response) => {
          if (response.status === 200) {
            alert("success");
            getTaskData();
          } else {
            alert("Failed");
          }
        });       
    };

    const onEdit = (id,name, date,priority, message) => {
      setTaskid(id);
      setAssigned(name);
      setDueDate(date);
      setPriority(priority);
      setMessage(message);
      handleShow();

    }

    const selectAssign = (id, name) => {
      setAssigned(name);
      setAssignedId(id);
  }

 const selectPriority = (eventKey) => {
      setPriority(eventKey);
  }

  const usersDropdown = usersData.map((user) => {
    return (
      <Dropdown.Item
        key={user.name}
        eventKey={user.name}
        onSelect={() => selectAssign(user.id, user.name)}
      >
        {user.name}
      </Dropdown.Item>
    );
  });

    return(
        <>
        <div className="container">
          <h1 className="text-center mt-5">Home Page</h1>
          <div className="d-flex justify-content-between mb-5">
          <input
          type="search"
          placeholder="Search Message"
          value={search}
          onChange={e => handleUserInput(e.target.value)}
        />
          <div>
          
          <Button variant="primary" onClick={handleCreate}>Create</Button>
          </div>
          </div>
          <div>
          <Table bordered hover >
              <thead style ={{backgroundColor:'gray'}}>
                  <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Assign</th>
                  <th>Message</th>
                  <th>Action/ Status</th>
                  </tr>
              </thead>
              <tbody>
              {filterTaskData?.map((item) => (
                  <tr>
                  <td>{item.id}</td>
                  <td>{item.assigned_name}</td>
                  <td>
                  {item.priority === "1" ? "Normal" : item.priority === "2" ? "Medium" : "High"}</td>
                  <td>{formatDate(item.due_date)}</td>
                  <td>{item.assigned_to}</td>
                  <td>{item.message}</td>
                  <td className="justify-content-around d-flex">
                  <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit</Tooltip>}>
                  <Link to="" onClick={() =>{onEdit(item.id,item.assigned_name,item.due_date,item.priority, item.message)}} className="text-decoration-none text-info ms-2">
                  <Pencil/></Link>
                  </OverlayTrigger>
                  {/* <Button variant="primary" onClick={handleShow}>
                    Edit
                  </Button> */}
                  <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete</Tooltip>}>
                  <Link to="" onClick={() => {
                              deleteOrder(item.id);
                            }} className="text-decoration-none text-danger"><Trash/></Link>
                  </OverlayTrigger>
                  </td>
                  </tr>
                  ))} 
              </tbody>
              </Table>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="mb-3 pt-5">
                  <Form.Group  as={Col} md="8" >
                    <Form.Label required="required">Task Id</Form.Label>
                    <Form.Control type="number" placeholder="" value={taskid} onChange={(e) => setTaskid(e.target.value)} />
                  </Form.Group>
                  <Form.Group  as={Col} md="4" >
                    <Form.Label required="required">Assign To</Form.Label>
                    <DropdownButton variant="light" title={assigned}>
                      {usersDropdown}
                    </DropdownButton>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group  as={Col} md="8" >
                    <Form.Label required="required">Due Date</Form.Label>
                    <Form.Control type="date" placeholder=""  onChange={(e) => setDueDate(e.target.value +" 12:12:12")} />
                  </Form.Group>
                  <Form.Group  as={Col} md="4" >
                    <Form.Label required="required">Priority</Form.Label>
                    <DropdownButton variant="light" title= {priority === "1" ? "Normal" : priority === "2" ? "Medium" : "High"}>
                        <Dropdown.Item onSelect= {selectPriority} eventKey="Normal">Normal</Dropdown.Item>
                        <Dropdown.Item onSelect= {selectPriority} eventKey="Medium">Medium</Dropdown.Item>
                        <Dropdown.Item onSelect= {selectPriority} eventKey="High">High</Dropdown.Item>
                    </DropdownButton>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3" >
                  <Form.Label required="required">Message</Form.Label>
                  <Form.Control as="textarea" rows={3}
                    name={"message"}
                    onChange={(e) => setMessage(e.target.value)}
                    value ={message} />
                </Form.Group>
              </Form>

              </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={onSubmit}>
                Save 
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        </>
    );
};
export default Home;

