import { animateChild, query, transition, trigger } from '@angular/animations';

// In order to wait for an animation to end on a child, this animation must be in the parent
export const awaitChildrenAnimationTrigger = trigger('awaitChildAnimation', [
  transition('* => void', [query('@*', [animateChild()], { optional: true })]),
]);
