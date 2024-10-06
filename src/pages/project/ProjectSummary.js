import Avatar from "../../components/Avatar";

export default function ProjectSummary({ project }) {
  const { name, dueDate, details, assignedUsersList } = project;

  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title">{name}</h2>
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
      </div>
    </div>
  );
}
