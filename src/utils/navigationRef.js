// src/utils/navigationRef.js
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navegarAlLogin() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index : 0,
        routes: [{ name: 'Login' }],
      })
    );
  } else {
    console.warn('navigationRef aún no listo');
  }
}
