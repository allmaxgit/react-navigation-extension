/**
 * Created by Bardiaswift
 *
 * @flow
 */

/* eslint-disable no-underscore-dangle, camelcase */

import { NavigationActions } from 'react-navigation';
import type {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
  NavigationNavigateAction,
} from 'react-navigation/src/TypeDefinition';

import routeNames from './routeNames';

type Navigator = {
  _navigation: NavigationScreenProp<NavigationState>,
  subs: ?{ remove: () => void }
};

const navigators: { [routeName: string]: ?Navigator } = {};

export function setNavigatior(routeName: string, navigator: any) {
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
  reset: (routeName?: string) => {
    const navigator = navigators[navigationRouteName];
    if (navigator) {
      const { _navigation } = navigator;
      const action = routeName ? NavigationActions.reset({
        actions: [NavigationActions.navigate({ routeName })],
        index: 0,
      }) : NavigationActions.back({ key: _navigation.state.routes[1].key });
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

export const mainNavigation = makeNavigation(routeNames.main);
export const jobsNavigation = makeNavigation(routeNames.jobs);
export const historyNavigation = makeNavigation(routeNames.history);
export const matchingNavigation = makeNavigation(routeNames.matching);
export const profileNavigation = makeNavigation(routeNames.profile);
export const supportNavigation = makeNavigation(routeNames.support);

export function getNavigationByName(routeName: ?string) {
  switch (routeName) {
    case routeNames.jobs:
      return jobsNavigation;
    case routeNames.history:
      return historyNavigation;
    default:
      return mainNavigation;
  }
}

let selectedTabRouteName: ?string;

export function getNavigationByTabRouteName(tabRouteName: ?string = selectedTabRouteName) {
  switch (tabRouteName) {
    case routeNames.jobs:
      return jobsNavigation;
    case routeNames.history:
      return historyNavigation;
    case routeNames.profile:
      return profileNavigation;
    case routeNames.support:
      return supportNavigation;
    default:
      return null;
  }
}

export function setSelectedTabRouteName(tabRouteName: ?string) {
  selectedTabRouteName = tabRouteName;
}
