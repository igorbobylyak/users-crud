import { animate, style, transition, trigger } from "@angular/animations";

export function fadeInOutAnimation(duration: number) {
    return trigger('fadeInOut', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate(`${duration}ms`, style({ opacity: 1 })),
        ]),
        transition(':leave', [
          animate(`${duration}ms`, style({ opacity: 0 })),
        ]),
    ]);
}

export const fadeInOut200ms = fadeInOutAnimation(200);