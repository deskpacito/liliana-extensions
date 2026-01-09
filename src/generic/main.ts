/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import {
  BasicRateLimiter,
  ContentRating,
  DiscoverSectionType,
  Form,
  PaperbackInterceptor,
  type Chapter,
  type ChapterDetails,
  type ChapterProviding,
  type DiscoverSection,
  type DiscoverSectionItem,
  type DiscoverSectionProviding,
  type Extension,
  type MangaProviding,
  type PagedResults,
  type SearchFilter,
  type SearchQuery,
  type SearchResultItem,
  type SearchResultsProviding,
  type SettingsFormProviding,
  type SourceManga,
  type Request,
} from "@paperback/types";

// Extension forms file
import { SettingsForm } from "./forms";
// Extension network file
import { MainInterceptor, fetchRequest } from "./network";
import { LilianaParser } from "./parser";

export interface GenericParams {
  name: string;
  domain: string;
  contentRating: ContentRating;
  language: string;
  excludeImagePatterns?: string[];
  basicRateLimiter?: {
    numberOfRequests: number;
    bufferInterval: number;
    ignoreImages?: boolean;
  };
  searchPagePathName?: string;
  searchMangaSelector?: string;
  searchRatingSelector?: string;
  hasProtectedChapters?: boolean;
  protectedChapterDataSelector?: string;
  chapterEndpoint?: number;
  chapterDetailsSelector?: string;
  bypassPage?: string;
  directoryPath?: string;
  parser?: LilianaParser;
  requestManager?: PaperbackInterceptor;
}

// Should match the capabilities which you defined in pbconfig.ts
type LilianaImplementation = SettingsFormProviding &
  Extension &
  DiscoverSectionProviding &
  SearchResultsProviding &
  MangaProviding &
  ChapterProviding;

// Main extension class
export abstract class Liliana implements LilianaImplementation {
  // Common properties
  readonly name: string;
  readonly domain: string;
  readonly defaultContentRating: ContentRating;
  readonly language: string;
  readonly searchPagePathName: string;
  readonly searchMangaSelector: string;
  parser: LilianaParser;

  // Implementation of the main rate limiter
  mainRateLimiter: BasicRateLimiter;

  // Implementation of the main interceptor
  mainInterceptor: PaperbackInterceptor;

  constructor(params: GenericParams) {
    this.name = params.name;
    this.domain = params.domain;
    this.defaultContentRating = params.contentRating;
    this.language = params.language;
    this.searchPagePathName = params.searchPagePathName ?? "page";
    this.searchMangaSelector = params.searchMangaSelector ?? "div#main div.grid > div";
    this.parser = params.parser ?? new LilianaParser();
    this.mainInterceptor = params.requestManager ?? new MainInterceptor("main");

    if (params.basicRateLimiter) {
      this.mainRateLimiter = new BasicRateLimiter("main", {
        numberOfRequests: params.basicRateLimiter.numberOfRequests,
        bufferInterval: params.basicRateLimiter.bufferInterval,
        ignoreImages: params.basicRateLimiter.ignoreImages ?? false,
      });
    } else {
      this.mainRateLimiter = new BasicRateLimiter("main", {
        numberOfRequests: 15,
        bufferInterval: 10,
        ignoreImages: true,
      });
    }
  }

  // Method from the Extension interface which we implement, initializes the rate limiter, interceptor, discover sections and search filters
  async initialise(): Promise<void> {
    this.mainRateLimiter.registerInterceptor();
    this.mainInterceptor.registerInterceptor();
  }

  // Implements the settings form, check SettingsForm.ts for more info
  async getSettingsForm(): Promise<Form> {
    return new SettingsForm();
  }

  async getDiscoverSections(): Promise<DiscoverSection[]> {
    const popularSection: DiscoverSection = {
      id: "popular",
      title: "Popular Manga",
      subtitle: "Most popular this week",
      type: DiscoverSectionType.prominentCarousel,
    };

    const latestSection: DiscoverSection = {
      id: "latest",
      title: "Latest Updates",
      subtitle: "Recently updated manga",
      type: DiscoverSectionType.simpleCarousel,
    };

    return [popularSection, latestSection];
  }

  // Populates both the discover sections
  async getDiscoverSectionItems(
    section: DiscoverSection,
    metadata: number | undefined,
  ): Promise<PagedResults<DiscoverSectionItem>> {
    const page = metadata ?? 1;
    let url = "";

    switch (section.id) {
      case "popular":
        url = `${this.domain}/ranking/week/${page}`;
        break;
      case "latest":
        url = `${this.domain}/all-manga/${page}/?sort=last_update&status=0`;
        break;
      default:
        return { items: [] };
    }

    const request: Request = {
      url: url,
      method: "GET",
    };

    const html = await fetchRequest(request);

    const items = await this.parser.parseDiscoverSectionItems(html, section, this);

    return {
      items: items,
      metadata: items.length > 0 ? page + 1 : undefined,
    };
  }

  // Populate search filters
  async getSearchFilters(): Promise<SearchFilter[]> {
    return [];
  }

  // Populates search
  async getSearchResults(
    query: SearchQuery,
    metadata?: number,
  ): Promise<PagedResults<SearchResultItem>> {
    const page = metadata ?? 1;

    const url = `${this.domain}/search/${page}/?keyword=${encodeURIComponent(query.title)}`;

    const request: Request = {
      url: url,
      method: "GET",
    };

    const html = await fetchRequest(request);

    const items = await this.parser.parseSearchResults(html, this);

    return {
      items: items,
      metadata: items.length > 0 ? page + 1 : undefined,
    };
  }

  // Populates the title details
  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    const request: Request = {
      url: `${this.domain}/${mangaId}`,
      method: "GET",
    };

    const html = await fetchRequest(request);

    return this.parser.parseMangaDetails(html, mangaId, this);
  }

  // Populates the chapter list
  async getChapters(sourceManga: SourceManga, _sinceDate?: Date): Promise<Chapter[]> {
    const request: Request = {
      url: `${this.domain}/${sourceManga.mangaId}`,
      method: "GET",
    };

    const html = await fetchRequest(request);

    return this.parser.parseChapterList(html, sourceManga, this);
  }

  // Populates a chapter with images
  async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
    const request: Request = {
      url: `${this.domain}/${chapter.chapterId}`,
      method: "GET",
    };

    const html = await fetchRequest(request);

    const numericChapterId = this.parser.getNumericChapterId(html);

    if (!numericChapterId) {
      throw new Error("Failed to find CHAPTER_ID");
    }

    // Now call AJAX
    const ajaxUrl = `${this.domain}/ajax/image/list/chap/${numericChapterId}`;
    const ajaxRequest: Request = {
      url: ajaxUrl,
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };

    const ajaxString = await fetchRequest(ajaxRequest);
    const ajaxJson = JSON.parse(ajaxString);

    if (!ajaxJson.html) {
      throw new Error("Failed to get image list HTML");
    }

    const pages = this.parser.parseAjaxImageList(ajaxJson.html);

    return {
      id: chapter.chapterId,
      mangaId: chapter.sourceManga.mangaId,
      pages: pages,
    };
  }
}
