import { ContentRating, SourceIntents, type ExtensionInfo } from "@paperback/types";
import { getVersion } from "../generic/version";

export default {
  name: "ManhuaPlusOrg",
  description: "Extension for manhuaplus.org",
  version: getVersion(),
  icon: "icon.png",
  language: "🇬🇧",
  contentRating: ContentRating.EVERYONE,
  capabilities:
    SourceIntents.SETTINGS_FORM_PROVIDING |
    SourceIntents.DISCOVER_SECIONS_PROVIDING |
    SourceIntents.SEARCH_RESULTS_PROVIDING |
    SourceIntents.CHAPTER_PROVIDING,
  badges: [],
  developers: [
    {
      name: "deskpacito",
      website: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      github: "https://github.com/deskpacito",
    },
  ],
} satisfies ExtensionInfo;
