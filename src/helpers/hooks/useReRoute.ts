import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardContext } from '../../contexts/BoardContext';
import { getRetro } from '../msal/services';

export default function useReRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const uuid = localStorage.getItem('uuid');
  const {
    state: { retroId, users, ended, loading, retroStarted },
    commitAction,
  } = React.useContext(BoardContext);

  const test = async () => {
    if (id) {
      const retrievedRetro = await getRetro(id);
    }
  };

  React.useEffect(() => {
    test();
  }, [id]);

  React.useEffect(() => {
    const found = users.some(el => el.userId === uuid);
    if (
      (uuid === null || uuid === undefined) &&
      window.location.pathname.includes('pulsecheck')
    ) {
      if (window.location.pathname.includes('enterprise'))
        navigate(`/enterprise/sessions/retroisfinished`);
      else if (window.location.pathname.includes('basic'))
        navigate(`/basic/sessions/retroisfinished`);
      else navigate(`/retroisfinished`);
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
      if (window.location.pathname.includes('enterprise'))
        navigate(`/enterprise/sessions/retroisfinished`);
      else if (window.location.pathname.includes('basic'))
        navigate(`/basic/sessions/retroisfinished`);
      else navigate(`/retroisfinished`);
    }
  }, [users, uuid, ended, retroId, loading, id]);
}
