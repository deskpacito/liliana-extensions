/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2026 Inkdex */

import { ContentRating, SourceIntents, type ExtensionInfo } from "@paperback/types";
import { getVersion } from "../generic/utils";

export default {
  name: "Raw1001",
  description: "Extension that pulls content from raw1001.net.",
  version: getVersion(),
  icon: "icon.png",
  language: "ja",
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
