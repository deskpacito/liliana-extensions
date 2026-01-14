/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { ContentRating, SourceIntents, type ExtensionInfo } from "@paperback/types";
import { getVersion } from "../generic/utils";

export default {
  name: "ManhuaPlus",
  description: "Extension that pulls content from manhuaplus.org.",
  version: getVersion(),
  icon: "icon.png",
  language: "en",
  contentRating: ContentRating.MATURE,
  capabilities:
    SourceIntents.DISCOVER_SECIONS_PROVIDING |
    SourceIntents.SEARCH_RESULTS_PROVIDING |
    SourceIntents.CHAPTER_PROVIDING,
  badges: [],
  developers: [
    {
      name: "deskpacito",
      github: "https://github.com/deskpacito",
    },
  ],
} satisfies ExtensionInfo;
