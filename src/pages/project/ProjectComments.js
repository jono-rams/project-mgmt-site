import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'
import { useFirestore } from "../../hooks/database";
import Avatar from "../../components/Avatar";
import { formatDistanceToNow } from "date-fns";

export default function ProjectComments({ project }) {
  const { updateDocument, response } = useFirestore('projects');
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: Timestamp.fromDate(new Date()),
      id: uuidv4()
    }

    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd]
    });

    if(!response.error) {
      setNewComment('');
    }
  };

  return (
    <div className='project-comments'>
      <h4>Project Comments</h4>

      <ul>
        {project.comments.length > 0 && project.comments.map(comment => (
          <li key={comment.id}>
            <div className="comment-author">
              <Avatar src={comment.photoURL} />
              <p>{comment.displayName}</p>
            </div>
            <div className="comment-date">
              <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
            </div>
            <div className="comment-content">
              <p>{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className='add-comment'>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={e => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <button disabled={response.isPending} className="btn">{response.isPending ? 'Adding Comment' : 'Add Comment'}</button>
      </form>
    </div>
  )
}