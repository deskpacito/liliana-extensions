/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { Liliana } from "../generic/main";
import pbconfig from "./pbconfig";

const MANHUAPLUS_DOMAIN = "https://manhuaplus.org";

export class ManhuaPlusORGExtension extends Liliana {
  constructor() {
    super({
      name: pbconfig.name,
      domain: MANHUAPLUS_DOMAIN,
      contentRating: pbconfig.contentRating,
      language: pbconfig.language,
    });
  }
}

export const ManhuaPlusORG = new ManhuaPlusORGExtension();
