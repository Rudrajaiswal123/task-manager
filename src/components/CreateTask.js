import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {Form, Row, Col, Button,Dropdown,DropdownButton} from "react-bootstrap";
import {doAjaxCall} from "../util";

const CreateTask = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [usersData, setUsersData] = useState([]);
    const [message, setMessage] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState(" Select Priority");
    const [assigned, setAssigned] = useState("Select assign");
    const [assignedId, setAssignedId] = useState("Select assign");
    
    const history = useHistory();


    const onSubmit = () => {
        const formData = new FormData();
       
        formData.append("message", message);
        formData.append("due_date",dueDate);
        if (priority === "Medium"){
            formData.append("priority", 2);  
        }
        else if(priority === "High"){
            formData.append("priority", 3);
        }
        else{
            formData.append("priority", 1);
        }
        formData.append("assigned_to", assignedId);
        
        doAjaxCall(`create`, "POST", formData )
        .then((response) => {
          if (response.status === 200) {
              alert("success");
              history.push('./');
            
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
        getUsersData();
      },[]);


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
            <div className=" container-fluid bg-info" style ={{height:'100vh'}}>
                <div className="w-50 m-auto pt-5">
                    <h1 className="">Create Task</h1>
                    <div>
                        <Form>
                            <Row className="mb-3 pt-5">
                                <Form.Group  as={Col} md="4" >
                                    <Form.Label required="required">Assign To</Form.Label>
                                    <DropdownButton variant="light" title={assigned}>
                                        {usersDropdown}
                                    </DropdownButton>
                                </Form.Group>
                                <Form.Group  as={Col} md="4" >
                                    <Form.Label required="required">Due Date</Form.Label>
                                    <Form.Control type="date" placeholder="" onChange={(e) => setDueDate(e.target.value +" 12:12:12")} />
                                </Form.Group>
                                <Form.Group  as={Col} md="4" >
                                    <Form.Label required="required">Priority</Form.Label>
                                    <DropdownButton variant="light" title= {priority}>
                                        <Dropdown.Item onSelect={selectPriority} eventKey="Normal">Normal</Dropdown.Item>
                                        <Dropdown.Item onSelect={selectPriority} eventKey="Medium">Medium</Dropdown.Item>
                                        <Dropdown.Item onSelect={selectPriority} eventKey="High">High</Dropdown.Item>
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
                            <Button className="me-3" onClick = {onSubmit}>Submit</Button>
                            <Button variant="danger" onClick = {history.goBack}>Cancel</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateTask;
