import ProjectFilter from '../../components/ProjectFilter';
import ProjectList from '../../components/ProjectList';
import { useCollection } from '../../hooks/database';
import { useFilter } from '../../hooks/useFilter';

// styles
import './Dashboard.css';

export default function Dashboard() {
  const { currentFilter, changeFilter, filterArray } = useFilter();
  const { documents, error } = useCollection(
    'projects',
    ['status', '!=', 'completed']
  );

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className='error'>Error: {error}</p>}
      {documents && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />}
      {documents && <ProjectList projects={filterArray(documents)} />}
    </div>
  );
}
