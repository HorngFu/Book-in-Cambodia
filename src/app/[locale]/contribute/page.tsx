import {
  BookPlus,
  CalendarHeart,
  Code,
  Flag,
  Heart,
  MapPin,
  PenLine,
  Search,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container, PageHero } from "@/components/layout/PageHero";
import { ButtonAnchor } from "@/components/ui/Button";
import { site } from "@/config/site";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getSiteSettings } from "@/lib/content";
import { forms, mailtoUrl } from "@/lib/contribute";
import { telegramUrl } from "@/lib/links";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: dict.nav.contributeLong,
    description: dict.contribute.lead,
    alternates: { canonical: href(locale, paths.contribute) },
  };
}

type Action = {
  id: string;
  icon: ReactNode;
  title: string;
  text: string;
  github: string;
  emailSubject: string;
};

export default async function ContributePage({ params }: { params: LocaleParams }) {
  const { dict } = await pageContext(params);
  const settings = await getSiteSettings();
  const c = dict.contribute;
  const icon = { size: 26, strokeWidth: 2, "aria-hidden": true } as const;

  const actions: Action[] = [
    {
      id: "request",
      icon: <Search {...icon} />,
      title: c.requestTitle,
      text: c.requestText,
      github: forms.requestBook(),
      emailSubject: "Book request",
    },
    {
      id: "listing",
      icon: <BookPlus {...icon} />,
      title: c.addListingTitle,
      text: c.addListingText,
      github: forms.addListing(),
      emailSubject: "Where to buy a book",
    },
    {
      id: "store",
      icon: <MapPin {...icon} />,
      title: c.addStoreTitle,
      text: c.addStoreText,
      github: forms.addStore(),
      emailSubject: "Add a bookstore or library",
    },
    {
      id: "event",
      icon: <CalendarHeart {...icon} />,
      title: c.eventTitle,
      text: c.eventText,
      github: forms.submitEvent(),
      emailSubject: "Event",
    },
    {
      id: "club",
      icon: <Users {...icon} />,
      title: c.clubTitle,
      text: c.clubText,
      github: forms.addBookClub(),
      emailSubject: "Book club",
    },
    {
      id: "donation",
      icon: <Heart {...icon} />,
      title: c.donationTitle,
      text: c.donationText,
      github: forms.addDonationPlace(),
      emailSubject: "A place that needs books",
    },
    {
      id: "report",
      icon: <Flag {...icon} />,
      title: c.reportTitle,
      text: c.reportText,
      github: forms.reportProblem(""),
      emailSubject: "Wrong information",
    },
  ];

  return (
    <>
      <PageHero start={c.title} accent={c.titleAccent} lead={c.lead} />
      <Container className="pt-14 md:pt-20">
        <p className="mb-8 rounded-md bg-surface p-4 text-sm">{c.githubNote}</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-6">
          {actions.map((action) => (
            <section
              key={action.id}
              id={action.id}
              aria-labelledby={`${action.id}-h`}
              className="flex scroll-mt-6 flex-col gap-3 rounded-lg bg-white p-7 shadow-card md:p-8"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-primary-tint text-primary">
                {action.icon}
              </span>
              <h2 id={`${action.id}-h`} className="mt-2 text-2xl tracking-tighter">
                {action.title}
              </h2>
              <p>{action.text}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-3">
                <ButtonAnchor href={action.github} variant="dark" size="sm">
                  {c.viaGithub}
                </ButtonAnchor>
                {settings.telegram ? (
                  <ButtonAnchor
                    href={telegramUrl(settings.telegram)}
                    variant="soft"
                    size="sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c.viaTelegram}
                  </ButtonAnchor>
                ) : null}
                {settings.contactFormUrl ? (
                  <ButtonAnchor
                    href={settings.contactFormUrl}
                    variant="soft"
                    size="sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c.viaForm}
                  </ButtonAnchor>
                ) : null}
                <ButtonAnchor href={mailtoUrl(action.emailSubject)} variant="soft" size="sm">
                  {c.viaEmail}
                </ButtonAnchor>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
          <section className="flex flex-col gap-3 rounded-lg bg-primary p-8 text-white">
            <PenLine size={26} aria-hidden="true" />
            <h2 className="text-2xl tracking-tighter text-white">{c.editorsTitle}</h2>
            <p className="text-primary-tint">{c.editorsText}</p>
            <ButtonAnchor
              href={`${site.repoUrl}/blob/main/docs/EDITOR_GUIDE.md`}
              variant="white"
              className="mt-2 self-start"
            >
              {c.editorsCta}
            </ButtonAnchor>
          </section>
          <section className="flex flex-col gap-3 rounded-lg bg-surface p-8">
            <Code size={26} aria-hidden="true" className="text-primary" />
            <h2 className="text-2xl tracking-tighter">{c.codeTitle}</h2>
            <p>{c.codeText}</p>
            <ButtonAnchor
              href={`${site.repoUrl}/blob/main/CONTRIBUTING.md`}
              variant="outline"
              className="mt-2 self-start"
            >
              {c.codeCta}
            </ButtonAnchor>
          </section>
        </div>
      </Container>
    </>
  );
}
