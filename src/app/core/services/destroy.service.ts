import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class DestroyService extends Subject<boolean> implements OnDestroy {
  /** @deprecated */
  public override next(): void {}
  /** @deprecated */
  public override complete(): void {}

  public ngOnDestroy(): void {
    super.next(true);
    super.complete();
  }
}
