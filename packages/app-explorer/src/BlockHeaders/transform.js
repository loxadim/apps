// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';

import { blockHeaders } from '../subjects';

export default function transform (header: Header): Array<Header> {
  const prev = blockHeaders.getValue();

  if (!header) {
    return prev;
  }

  return prev
    .filter((value, index) => index < 9)
    .reduce((next, value, index) => {
      next.push(value);

      return next;
    }, [header]);
}