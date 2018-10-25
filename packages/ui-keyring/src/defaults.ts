// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/keyring';

const ACCOUNT_PREFIX = 'account:';
const ADDRESS_PREFIX = 'address:';
const MAX_PASS_LEN = 32;

function toHex (address: string): string {
  return u8aToHex(
    decodeAddress(address)
  );
}

const accountKey = (address: string): string =>
  `${ACCOUNT_PREFIX}${address}`;

const addressKey = (address: string): string =>
  `${ADDRESS_PREFIX}${address}`;

const accountRegex = new RegExp(`^${ACCOUNT_PREFIX}`, '');

const addressRegex = new RegExp(`^${ADDRESS_PREFIX}`, '');

export {
  accountKey,
  accountRegex,
  addressKey,
  addressRegex,
  toHex,
  MAX_PASS_LEN
};
