/**
 * Created by Bardiaswift
 *
 * @flow
 */

/* eslint-disable no-underscore-dangle, camelcase */

import type { ElementRef } from 'react';
import { NavigationActions } from 'react-navigation';
import type {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
  NavigationNavigateAction,
} from 'react-navigation/src/TypeDefinition';

type Navigator = {
  _navigation: NavigationScreenProp<NavigationState>,
  subs: ?{ remove: () => void }
};

const navigators: { [routeName: string]: ?Navigator } = {};

export function setNavigatior(routeName: string, navigator: ElementRef<*>) {
  if (navigator) {
    const { subs } = navigator;
    if (subs) {
      subs.remove();
    }
    navigators[routeName] = navigator;
  }
}

export const makeNavigation = (navigationRouteName: string) => ({
  navigate: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction,
  ): boolean => {
    const navigator = navigators[navigationRouteName];
    if (navigator) {
      return navigator._navigation.navigate(routeName, params, action);
    }
    return false;
  },
  setParams: (params: NavigationParams): boolean => {
    const navigator = navigators[navigationRouteName];
    if (navigator) {
      const { _navigation } = navigator;
      const action = NavigationActions.setParams({
        key: _navigation.state.routes[0].key,
        params,
      });
      _navigation.dispatch(action);
    }
    return false;
  },
  goBack: () => {
    const navigator = navigators[navigationRouteName];
    if (navigator) {
      navigator._navigation.goBack();
    }
  },
  reset: (routeName?: string | string[], params?: Object) => {
    const navigator = navigators[navigationRouteName];
    if (navigator) {
      const { _navigation } = navigator;
      let action: NavigationNavigateAction;
      if (routeName) {
        const actions: NavigationNavigateAction[] = [];
        let index: number;
        if (Array.isArray(routeName)) {
          index = routeName.length - 1;
          routeName.forEach((rn, i) => {
            const payload: {
              routeName: string,
              params?: ?NavigationParams,
              action?: ?NavigationNavigateAction,
            } = { routeName: rn };
            if (i === index && params) {
              payload.params = params;
            }
            actions.push(NavigationActions.navigate(payload));
          });
        } else {
          actions.push(NavigationActions.navigate({ routeName, params }));
          index = 0;
        }
        action = NavigationActions.reset({ actions, index });
      } else {
        action = NavigationActions.back({ key: _navigation.state.routes[1].key });
      }
      _navigation.dispatch(action);
    }
  },
  getCanNavigateBack: () => {
    const navigator = navigators[navigationRouteName];
    if (navigator) {
      return navigator._navigation.state.index > 0;
    }
    return false;
  },
});
