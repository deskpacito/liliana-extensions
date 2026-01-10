import { ContentRating, SourceIntents, type ExtensionInfo } from "@paperback/types";
import { getVersion } from "../generic/version";

export default {
  name: "MangaKoma",
  description: "Extension for mangakoma.net",
  version: getVersion(),
  icon: "static/icon.png",
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
