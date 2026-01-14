/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { Liliana } from "../generic/main";
import pbconfig from "./pbconfig";

const MANHUAPLUS_DOMAIN = "https://manhuaplus.org";

export class ManhuaPlusExtension extends Liliana {
  constructor() {
    super({
      domain: MANHUAPLUS_DOMAIN,
      contentRating: pbconfig.contentRating,
      language: pbconfig.language,
    });
  }
}

export const ManhuaPlus = new ManhuaPlusExtension();
