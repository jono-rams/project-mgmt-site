import ProjectFilter from '../../components/ProjectFilter';
import ProjectList from '../../components/ProjectList';
import { useCollection } from '../../hooks/database';
import { useFilter } from '../../hooks/useFilter';

// styles
import './CompletedProjects.css';

export default function CompletedProjects() {
  const { currentFilter, changeFilter, filterArray } = useFilter();
  const { documents, error } = useCollection(
    'projects',
    ['status', '==', 'completed']
  );

  return (
    <div>
      <h2 className="page-title">Completed Projects</h2>
      {error && <p className='error'>Error: {error}</p>}
      {documents && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />}
      {documents && <ProjectList projects={filterArray(documents)} />}
    </div>
  );
}