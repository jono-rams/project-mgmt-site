import ProjectList from '../../components/ProjectList';
import { useCollection } from '../../hooks/database';

// styles
import './CompletedProjects.css'

export default function CompletedProjects() {
  const { documents, error } = useCollection(
    'projects',
    ['status', '==', 'completed']
  );

  return (
    <div>
      <h2 className="page-title">Completed Projects</h2>
      {error && <p className='error'>Error: {error}</p>}
      {documents && <ProjectList projects={documents} />}
    </div>
  )
}