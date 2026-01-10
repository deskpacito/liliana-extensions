/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { Liliana } from "../generic/main";
import pbconfig from "./pbconfig";

const MANGAKOMA_DOMAIN = "https://mangakoma.net";

export class MangaKomaExtension extends Liliana {
  constructor() {
    super({
      name: pbconfig.name,
      domain: MANGAKOMA_DOMAIN,
      contentRating: pbconfig.contentRating,
      language: pbconfig.language,
    });
  }
}

export const MangaKoma = new MangaKomaExtension();
