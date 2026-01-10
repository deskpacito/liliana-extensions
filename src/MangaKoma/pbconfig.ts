import { ContentRating, SourceIntents, type ExtensionInfo } from "@paperback/types";
import { getVersion } from "../generic/version";

export default {
  name: "MangaKoma",
  description:
    "Extension for mangakoma.net, which is a clone of raw1001.net. Use as a mirror/backup in case one of them gets taken down.",
  version: getVersion(),
  icon: "icon.png",
  language: "🇯🇵",
  contentRating: ContentRating.MATURE,
  capabilities:
    SourceIntents.SETTINGS_FORM_PROVIDING |
    SourceIntents.DISCOVER_SECIONS_PROVIDING |
    SourceIntents.SEARCH_RESULTS_PROVIDING |
    SourceIntents.CHAPTER_PROVIDING,
  badges: [],
  developers: [
    {
      name: "deskpacito",
      website: "https://github.com/deskpacito",
      github: "https://github.com/deskpacito",
    },
  ],
} satisfies ExtensionInfo;
