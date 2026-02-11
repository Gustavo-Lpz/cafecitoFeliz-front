import { CanActivateFn } from '@angular/router';

export const adminGuardsGuard: CanActivateFn = (route, state) => {
  return true;
};
