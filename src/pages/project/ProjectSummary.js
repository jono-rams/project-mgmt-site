import Avatar from "../../components/Avatar";
import { useFirestore } from "../../hooks/database";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../hooks/useAuthContext";

export default function ProjectSummary({ project }) {
  const { name, dueDate, details, assignedUsersList, createdBy } = project;
  const { updateDocument, response } = useFirestore('projects');
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    await updateDocument(project.id, {
      status: 'completed'
    });

    if (!response.error) {
      navigate('/', { replace: true });
      navigate(0);
    }
  };

  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title">{name}</h2>
        <p>By {project.createdBy.displayName}</p>
        <p className="due-date">
          Project due by {dueDate.toDate().toDateString()}
        </p>
        <p className="details">{details}</p>
        <h4>Project is assigned to:</h4>
        <div className="assigned-users">
          {assignedUsersList.map(user => (
            <div key={user.photoURL}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
        {createdBy.id === user.uid && <button disabled={response.isPending} onClick={handleClick} className='btn'>{response.isPending ? 'Marking as Complete...' : 'Mark as Complete'}</button>}
      </div>
    </div>
  );
}
