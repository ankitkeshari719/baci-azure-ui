import { useNavigate, useParams } from 'react-router-dom';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import log from 'loglevel';
import React from 'react';
import { FEATURE_FLAGS } from '../constants';
import { ErrorContext } from '../contexts/ErrorContext';
import { getRetro } from '../msal/services';
import { useMediaQuery } from '@mui/material';
import theme from '../theme/theme';

export default function useReRoute() {
    const navigate = useNavigate();
    const { id } = useParams();
    const uuid = localStorage.getItem('uuid');
    const { error, setError } = React.useContext(ErrorContext);
    const [global, dispatch] = React.useContext(GlobalContext);
    const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
    const {
        state: { retroId, users, ended, loading, retroStarted },
        commitAction,
    } = React.useContext(BoardContext);


    React.useEffect(() => {
        if (window.location.pathname.includes('join') && ended) {
            const found = users.some(el => el.userId === uuid);
            console.log('Join Page......', found);
            if (!found) {
                navigate(`/retroisfinished`);
            }
        }
    }, [retroId, loading])
}
