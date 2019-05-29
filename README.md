#### Getting started

1. Install package

  ```
  yarn add react-navigation-extension
  ```

2. Set navigation container

  ```tsx
  import React, {
    memo,
    useRef,
    useLayoutEffect,
  } from 'react';
  import {
    NavigationContainerComponent,
  } from 'react-navigation';

  import {
    navigationNames,
  } from '~/global';
  import {
    Navigation,
  } from '~/navigation';
  import {
    setNavigationContainer,
  } from '~/components';

  export const UnconnectedApp = memo<{}>(() => {
    const navigationRef = useRef<NavigationContainerComponent>(null);
    useLayoutEffect(() => {
      setNavigationContainer(navigationNames.main, navigationRef);
    }, []);
    return (
      <Navigation
        ref={navigationRef}
      />
    );
  });

  ```

3. Create navigation

  ```ts
  import {
    createNavigation,
  } from 'react-navigation-extension';

  import {
    navigationNames,
  } from '~/global';
  
  export const mainNavigation = createNavigation(navigationNames.main);
  ```

4. Navigate simple

  ```ts
  import {
    mainNavigation,
  } from '~/navigation';

  mainNavigation.navigate('SIGN_UP');
  mainNavigation.reset(['SIGN_IN', 'FORGOT_PASSWORD'], { email: 'user@mail.com' });
  ```

#### Available methods

  ```ts
  navigate: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction,
    key?: string,
  ) => void,
  setParams: (params: NavigationParams, key?: string) => void,
  goBack: (key?: string | null) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const action = NavigationActions.back({ key });
      navigator.dispatch(action);
    }
  },
  push: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction,
    key?: string,
  ) => void,
  pop: (n?: number) => void,
  reset: (routeName?: string | string[], params?: NavigationParams) => void,
  getCanNavigateBack: () => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const {
        state: {
          nav: {
            index,
          },
        },
      } = navigator;
      return index > 0;
    }
    return false;
  },
  getCurrentRouteName: () => string | null,
  ```
