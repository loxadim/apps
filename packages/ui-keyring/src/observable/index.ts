// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringJson } from '../types';
import { AccountSubject, AddressSubject, KeyringObservableInstance, SingleAddress, SubjectInfo } from './types';

import store from 'store';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import createOptionItem from '../options/item';
import { accountKey, addressKey } from '../defaults';

class KeyringObservable implements KeyringObservableInstance {
  subject = new BehaviorSubject(false);

  all (): Observable<any> {
    return combineLatest(
      this.accounts().subject,
      this.addresses().subject
    ).pipe(
      map(([accounts, addresses]) => ({
        accounts,
        addresses
      }))
    );
  }

  accounts (): AccountSubject {
    return this.genericSubject(accountKey, true);
  }

  addresses (): AddressSubject {
    return this.genericSubject(addressKey);
  }

  genericSubject (keyCreator: (address: string) => string, withTest: boolean = false): AddressSubject {
    let current: SubjectInfo = {};
    const subject = new BehaviorSubject({});
    const next = (): void => {
      const isDevMode = this.isDevelopment();

      subject.next(
        Object
          .keys(current)
          .reduce((filtered, key) => {
            const { json: { meta: { isTesting = false } = {} } = {} } = current[key];

            if (!withTest || isDevMode || isTesting !== true) {
              filtered[key] = current[key];
            }

            return filtered;
          }, {} as SubjectInfo)
      );
    };

    this.subject.subscribe(next);

    return {
      add: (address: string, json: KeyringJson): SingleAddress => {
        current = { ...current };

        current[address] = {
          json,
          option: createOptionItem(address, json.meta.name)
        };

        store.set(keyCreator(address), json);
        next();

        return current[address];
      },
      remove: (address: string) => {
        current = { ...current };

        delete current[address];

        store.remove(keyCreator(address));
        next();
      },
      subject
    };
  }

  isDevelopment (): boolean {
    return this.subject.getValue();
  }

  set (isDevelopment: boolean): void {
    this.subject.next(isDevelopment);
  }
}

const keyringObservableInstance = new KeyringObservable();

export default keyringObservableInstance;
