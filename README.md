#### Getting started

1. Install package

  ```
  yarn add react-navigation-extension
  ```

2. Set navigator

  ```javascript
  import { setNavigatior } from 'react-navigation-extension';

  <AppContainer ref={setNavigatior(navigationNames.main)} />
  ```

3. Create navigation

  ```javascript
  import { createNavigation } from 'react-navigation-extension';
  
  export const mainNavigation = createNavigation('MAIN_NAVIGATOR');
  ```

4. Navigate simple

  ```javascript
  import { mainNavigation } from '~/navigation';

  mainNavigation.navigate('SIGN_UP');
  mainNavigation.reset(['SIGN_IN', 'FORGOT_PASSWORD'], { email: 'user@mail.com' });
  ```

#### Available methods

  ```javascript
  export const makeNavigation = (navigationRouteName: string) => ({
    navigate: (
      routeName: string,
      params?: NavigationParams,
      action?: ?NavigationNavigateAction,
      key?: string,
    ) => void,
    setParams: (params: NavigationParams, key?: string) => void,
    goBack: (key?: ?string) => void,
    pop: (n?: number) => void,
    reset: (routeName?: string | Array<string>, params?: Object) => void,
    getCanNavigateBack: () => boolean,
    getCurrentRouteName: () => ?string,
  });
  ```
