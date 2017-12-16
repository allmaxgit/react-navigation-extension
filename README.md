#### Getting started

1. Install package:

  ```
  yarn add react-navigation-extension
  ```

2. Set navigator

  ```javascript
  import { setNavigatior } from 'react-navigation-extension';

  <Navigator ref={(ref) => { setNavigatior('MAIN_NAVIGATOR', ref); }} />
  ```

3. Make navigation

  ```javascript
  export const mainNavigation = makeNavigation('MAIN_NAVIGATOR');
  ```

4. Navigate simple

  ```javascript
  import { mainNavigation } from 'react-navigation-extension';

  mainNavigation.navigate('SIGN_UP')
  ```

#### Available methods

  ```javascript
  export const makeNavigation = (navigationRouteName: string) => ({
    navigate: (
      routeName: string,
      params?: NavigationParams,
      action?: NavigationNavigateAction,
    ): boolean => {},
    setParams: (params: NavigationParams): boolean => {},
    goBack: () => {},
    reset: (routeName?: string) => {},
    getCanNavigateBack: () => {},
  });
  ```
