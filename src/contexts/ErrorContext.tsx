import { useMediaQuery } from '@mui/material';
import React, { ComponentProps } from 'react';

import ErrorDialog from '../atoms/ErrorDialog';
import ErrorMobileDialog from '../atoms/ErrorMobileDialog';
import theme from '../theme/theme';

export interface ErrorContextType {
  error: string | undefined;
  setError: (error: string) => void;
}

const ErrorContext = React.createContext<ErrorContextType>({
  error: undefined,
  setError: error => {},
});

function ErrorProvider(props: ComponentProps<any>) {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {error && !isXsUp ? <ErrorDialog error={error} /> : null}
      {error && isXsUp ? <ErrorMobileDialog error={error} /> : null}
      {props.children}
    </ErrorContext.Provider>
  );
}

export { ErrorProvider, ErrorContext };
