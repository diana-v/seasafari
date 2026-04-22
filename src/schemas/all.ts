import { SanityClient } from '@sanity/client';

import { AboutSectionResponse } from '@/schemas/about';
import { BlogsSectionResponse } from '@/schemas/blogs';
import { ContactSectionResponse } from '@/schemas/contact';
import { FooterSectionResponse } from '@/schemas/footer';
import { GallerySectionResponse } from '@/schemas/gallery';
import { GiftCardSectionResponse } from '@/schemas/giftCard';
import { GiftCardWidgetResponse } from '@/schemas/giftCardWidget';
import { HomeSectionResponse } from '@/schemas/home';
import { NavigationSectionResponse } from '@/schemas/navigation';
import { OffersSectionResponse } from '@/schemas/offers';
import { PartnersSectionResponse } from '@/schemas/partners';
import { ReviewsSectionResponse } from '@/schemas/reviews';

export interface AllHomeSectionResponse {
    about: AboutSectionResponse;
    blogs: BlogsSectionResponse;
    contact: ContactSectionResponse;
    footer: FooterSectionResponse;
    gallery: GallerySectionResponse;
    giftCard: GiftCardSectionResponse;
    giftCardWidget: GiftCardWidgetResponse;
    home: HomeSectionResponse;
    navigation: NavigationSectionResponse;
    offers: OffersSectionResponse;
    partners: PartnersSectionResponse;
    reviews: ReviewsSectionResponse;
}

export const fetchAllHomeSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<AllHomeSectionResponse> =>
    client.fetch(
        `
    "about": *[_type == "about"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "benefits": benefits[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            "image": image.asset->url
        }
    }[0],
    "blogs": *[_type == "blogs"] {
        "slug": slug.current,
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": *[_type == "blog"] | order(orderRank) [0...2] {
            "slug": slug.current,
            "image": image.asset->url,
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            backgroundColor,
            _createdAt,
            orderRank,
        } | order(orderRank)
    }[0],
    "contact": *[_type == "contact"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "formTitle": coalesce(formTitle.[$locale], formTitle.[$defaultLocale]),
        "phone": *[_type == "common"].phone
    }[0],
    "footer": *[_type == "footer"] {
      "common": *[_type == "common"] {
        "logo": logo.asset->url,
        phone,
        email,
        "address": coalesce(address.[$locale], address.[$defaultLocale], "Missing translation"),
        "companyDetails": companyDetails {
          name,
          "companyCode": coalesce(companyCode.[$locale], companyCode.[$defaultLocale], "Missing translation"),
          "address": coalesce(address.[$locale], address.[$defaultLocale], "Missing translation")
        },
        "socialLinks": socialLinks[] {
          "platform": coalesce(platform.[$locale], platform.[$defaultLocale], "Missing translation"),
          "link": coalesce(link.[$locale], link.[$defaultLocale], "Missing translation"),
          "icon": icon.asset->url
        },
        "privacyPolicy": privacyPolicy {
          "slug": slug.current,
        },
        "purchaseRules": purchaseRules {
          "slug": slug.current,
        }
      }[0],
      "faq": *[_type == "faq"] {
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
      }[0],
    }[0],
    "gallery": *[_type == "gallery"]{
        "cards": cards[] {
            "image": image.asset->url,
            url,
        },
    }[0],
    "giftCard": *[_type == "giftCard"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
        "bullets": bullets[]{
          "text": coalesce(@[$locale], @[$defaultLocale], "Missing translation")
        },
        "image": image.asset->url,
        "options": options[] {
          "label": coalesce(label.[$locale], label.[$defaultLocale], "Missing translation"),
          value,
        }
    }[0],
    "giftCardWidget": *[_type == "giftCardWidget"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        link,
    }[0],
    "home": *[_type == "home"]{
        "videoWebm": videoWebm.asset->url,
        "videoMp4": videoMp4.asset->url,
        "image": image.asset->url,
        "heroMedia": {
            "desktopContent": heroMedia.desktopContent,
            "mobileContent": heroMedia.mobileContent
        },
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "subtitle": coalesce(subtitle.[$locale], subtitle.[$defaultLocale]),
        "cta": {
            "link": coalesce(cta.link.[$locale], cta.link.[$defaultLocale]),
            "label": coalesce(cta.label.[$locale], cta.label.[$defaultLocale]),
        }
    }[0],
    "navigation": *[_type == "common"]{
        "logo": logo.asset->url,
        phone
    }[0],
    "offers": *[_type == "offers"] {
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": *[_type == "offer"] {
            "slug": slug.current,
            "imageCompressed": imageCompressed.asset->url,
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            "linkTitle": coalesce(linkTitle.[$locale], linkTitle.[$defaultLocale], "Missing translation"),
            orderRank,
        } | order(orderRank)
    }[0],
    "partners": *[_type == "partners"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "logos": logos[] {
            "image": image.asset->url,
        },
    }[0],
    "reviews": *[_type == "reviews"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { defaultLocale, locale },
        {
            cache: 'force-cache',
            next: {
                revalidate: 86_400,
                tags: ['all_home']
            }
        }
    );
