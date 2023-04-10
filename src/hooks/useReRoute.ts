import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardContext } from '../contexts/BoardContext';

export default function useReRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const uuid = localStorage.getItem('uuid');
  const {
    state: { retroId, users, ended, loading, retroStarted },
    commitAction,
  } = React.useContext(BoardContext);

  React.useEffect(() => {
    const found = users.some(el => el.userId === uuid);
    // console.log('users:::', users);
    // console.log('uuid:::', uuid);
    // console.log('ended:::', ended);
    // console.log('found:::', found);

    if (
      uuid === null &&
      (window.location.pathname.includes('pulsecheck') ||
        window.location.pathname.includes('report'))
    ) {
      navigate(`/retroisfinished`);
    }

    if (
      (window.location.pathname.includes('join') ||
        window.location.pathname.includes('waiting') ||
        window.location.pathname.includes('pulsecheck') ||
        window.location.pathname.includes('board') ||
        window.location.pathname.includes('report')) &&
      ended &&
      !found
    ) {
      navigate(`/retroisfinished`);
    }
  }, [users, uuid, ended, retroId, loading, id]);
}
