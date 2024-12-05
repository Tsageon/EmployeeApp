import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import './app2.css';

function Form() {
  const [employees, setEmployees] = useState(() => JSON.parse(localStorage.getItem('Employees')) || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', gender: '', email: '', phone: '', image: '', position: '', id: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('form');
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = newEmployee.name ? "" : "This field is required.";
    tempErrors.gender = newEmployee.gender ? "" : "What's Your Gender?";
    tempErrors.email = newEmployee.email ? (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmployee.email) ? "" : "Invalid email format.") : "This field is required.";
    tempErrors.phone = newEmployee.phone ? (/^\d{10}$/.test(newEmployee.phone) ? "" : "Phone number must be 10 digits.") : "This field is required.";
    tempErrors.image = newEmployee.image ? "" : "Profile Picture is required.";
    tempErrors.position = newEmployee.position ? "" : "Position is required.";
    tempErrors.id = newEmployee.id ? (/^\d{13}$/.test(newEmployee.id) ? "" : "This needs to be 13 digits.") : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const resetForm = () => {
    setNewEmployee({ name: '', gender: '', email: '', phone: '', image: '', position: '', id: '' });
    setIsEditing(false);
    setCurrentEmployeeId('');
    setErrors({});
  };

  const deleteEmployee = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedEmployees = employees.filter(employee => employee.id !== id);
        setEmployees(updatedEmployees);
        Swal.fire(
          'Deleted!',
          'The employee has been deleted.',
          'success'
        );
      }
    });
  };

  const editEmployee = (employee) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setCurrentEmployeeId(employee.id);
    setActiveTab('form');
  };

  useEffect(() => {
    localStorage.setItem('Employees', JSON.stringify(employees));
  }, [employees]);

  const handleSubmit = () => {
    if (!validate()) return;

    const employeeData = {
      ...newEmployee,
      image: newEmployee.image ? URL.createObjectURL(newEmployee.image) : '',
    };

    setEmployees(prevEmployees => {
      let updatedEmployees;

      if (isEditing) {
        updatedEmployees = prevEmployees.map(emp =>
          emp.id === currentEmployeeId ? {...employeeData, id: currentEmployeeId } : emp
        );
      } else {
        const newEmployeeWithId = {
          ...employeeData,
          id: Date.now().toString(),
        };
        updatedEmployees = [...prevEmployees, newEmployeeWithId];
      }
      return updatedEmployees;
    });
    Swal.fire({
      title: isEditing ? 'Employee Updated!' : 'New Employee Added!',
      text: isEditing ? 'The employee details were updated successfully.' : 'The new employee has been added.',
      icon: 'success',
      confirmButtonText: 'OK'
    });  

    resetForm();
  };

  const handleSearch = () => {
    setFilteredEmployees(employees.filter(employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.includes(searchQuery)
    ));
    setActiveTab('list');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);
  };


  const Logout = () =>{
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Log Out',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login');
        Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
      }
    });
  }

  const renderForm = () => (
    <>
      <input type="text" placeholder="Name" value={newEmployee.name}
        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
      <div className="error">{errors.name}</div>

      <input type="email" placeholder="Email" value={newEmployee.email}
        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
      <div className="error">{errors.email}</div>

      <input type="text" placeholder="Phone Number" value={newEmployee.phone}
        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
      <div className="error">{errors.phone}</div>

      <input type="file" accept="image/*"
        onChange={(e) => setNewEmployee({ ...newEmployee, image: e.target.files[0] })} />
      <div className="error">{errors.image}</div>

      <select className="styled-select"
        value={newEmployee.gender}
        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <div className="error">{errors.gender}</div>

      <input type="text" placeholder="Position" value={newEmployee.position}
        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
      <div className="error">{errors.position}</div>

      <input type="text" placeholder="ID" value={newEmployee.id}
        onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })} />
      <div className="error">{errors.id}</div>

      <button className='edit-btns' onClick={handleSubmit}>
        {isEditing ? 'Update' : 'Submit'}
      </button>
      {isEditing && <button onClick={resetForm}>Cancel</button>}
    </>
  );

  const renderEmployeeList = () => (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Position</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(searchQuery ? filteredEmployees : employees).length > 0 ? (
            (searchQuery ? filteredEmployees : employees).map(employee => (
              <tr key={employee.id}>
                <td>
                  {employee.image ? (
                    <img src={employee.image} alt={employee.name} className="employee-image" />
                  ) : (
                    <img src='https://st4.depositphotos.com/17418852/23170/v/1600/depositphotos_231708598-stock-illustration-oops-sorry-don-know-young.jpg'  className="employee-image"  alt='Nothing' />
                  )}
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.gender}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                <td>{employee.id}</td>
                <td>
                  <button className='edit' onClick={() => editEmployee(employee)}>Edit</button>
                  <button className='delete' onClick={() => deleteEmployee(employee.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8"><b><i>No employees yet</i></b></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSearch = () => (
    <>
      <input type="text" placeholder="Search for employee" value={searchQuery} onChange={handleSearchChange} />
      <button className='search' onClick={handleSearch}>Search</button>
    </>
  );

  return (
    <div className="App">
      <h1>Employee Registration Form</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('form')} className={activeTab === 'form' ? 'active-tab' : ''}>Employee Form</button>
        <button onClick={() => setActiveTab('list')} className={activeTab === 'list' ? 'active-tab' : ''}>Employee List</button>
        <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active-tab' : ''}>Search</button>
        <button onClick={Logout} className={activeTab === 'logout' ? 'active-tab': ''}>Logout</button>
      </div>
      {activeTab === 'form' && (
        <div>
          <h2 className="Two-headings">{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
          {renderForm()}
        </div>
      )}
      {activeTab === 'list' && (
        <div>
          <h2 className="Two-headings">Employee List</h2>
          {renderEmployeeList()}
        </div>
      )}
      {activeTab === 'search' && (
        <div>
          <h2 className="Query-heading">Employee Query</h2>
          {renderSearch()}
          {searchQuery && renderEmployeeList()}
        </div>
      )}
    </div>
  );
}

export default Form;