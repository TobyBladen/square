import { Store } from '@ngxs/store';

import { AppStateModel } from '../app.state.model';

export const reset = (store: Store, state: AppStateModel): void =>
    store.reset({ app: state });
