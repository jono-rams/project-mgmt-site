import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useCollection, useFirestore } from '../../hooks/database';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

// styles
import './Create.css'

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
];

export default function Create() {
  // form field values
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  const { documents, error } = useCollection('users');
  const [users, setUsers] = useState([]);
  const { user } = useAuthContext();

  const { addDocument, response } = useFirestore('projects');

  const navigate = useNavigate();

  useEffect(() => {
    if (documents && !error) {
      setUsers(documents.map((u) => ({ value: u, label: u.displayName })));
    }
  }, [documents, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: add new project to the list here
    setFormError(null);
    if (!category) {
      setFormError("Please select a project category");
      return;
    }
    if (assignedUsers.length < 1) {
      setFormError("Please select at least one user to assign");
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    const assignedUsersList = assignedUsers.map((u) => { 
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    });

    const project = {
      status: 'pending',
      name,
      details,
      category: category.value,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      createdBy,
      assignedUsersList,
      comments: []
    }

    addDocument(project).then(() => {
      if(!response.error) {
        navigate('/', {replace: true});
        navigate(0);
      }
    })
  }

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new project</h2>
        {error && <div className='error'>{error}</div>}
        {!error && (<form onSubmit={handleSubmit}>
          <label>
            <span>Project Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Project Details:</span>
            <textarea
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Set due date:</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Project Category:</span>
            <Select 
              onChange={(selected) => setCategory(selected)}
              options={categories}
            />
          </label>
          <label>
            <span>Assign to:</span>
            <Select 
              options={users}
              onChange={option => setAssignedUsers(option)}
              isMulti
            />
          </label>
          <button disabled={response.isPending} className='btn'>{response.isPending ? 'Adding Project' : 'Add Project'}</button>
          {formError && <div className='error'>{formError}</div>}
        </form>)}
    </div>
  )
}
