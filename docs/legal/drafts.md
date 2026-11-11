# Tinteruna legal drafts

Working version 0.1, prepared on November 10, 2026. These internal English drafts require legal review and operational decisions before publication. The approved user-facing documents will be written in Spanish. Their effective date will be set when publication is approved.

## Decisions required before publication

- Load the operator's details from private server environment variables when preparing the notice, following Article 2.2.2.25.3.1 of Decree 1074 of 2015. The details were supplied for local configuration. Details displayed in a published notice will be readable by its visitors.
- Confirm email delivery configuration, processing regions, processors, contracts, log and backup retention, deletion procedures and rights-request handling.
- Review the processing of data belonging to adolescents aged 15 to 17. Registration needs a verifiable process for representative authorization, the adolescent's right to be heard, and assessment of their best interests and fundamental rights. The intended audience older than 14 requires that implementation and legal review.
- Approve processing purposes and the applicable data-processing authorization. Terms acceptance and personal-data authorization need distinct controls and verifiable records where required.
- Implement and verify pre-registration links, rights requests, account recovery and account closure. Inventory cookies in an authenticated session before publishing their lifetimes.

## Privacy notice and personal-data processing policy

### Responsibility for your data

Tinteruna's operator will be identified by the name configured in `TINTERUNA_OPERATOR_NAME`. The service launches initially in Colombia. Privacy, support and data requests will use the channel configured in `TINTERUNA_PRIVACY_EMAIL`. Domicile, address and telephone will be loaded from `TINTERUNA_OPERATOR_CITY`, `TINTERUNA_OPERATOR_ADDRESS` and `TINTERUNA_OPERATOR_PHONE` when preparing the approved document for publication.

### Information Tinteruna uses

Tinteruna provides a personal reading library. Creating and using an account involves processing your email and the information needed to authenticate you. Supabase Auth manages passwords and sessions.

Your library can contain book titles, authors, editions, covers, reading states, ratings, reading dates, goals, personal notes, quotations and favorite characters. You decide which annotations to write and can edit them. Keep annotations focused on your reading and avoid unnecessary personal information about other people or sensitive information.

The service also processes confirmed book searches and the technical requests needed to deliver pages and protect accounts.

### Processing purposes

Information is used to authenticate you, save and display your library, preserve annotations, calculate reading progress and respond to requests. Authentication, account isolation and request quotas help protect the service.

Google Books receives the search query when you activate the search action. Personal notes and quotations are stored as private library content. The application's external metadata and image requests contain the search or image information needed for those operations.

### Providers and data flows

The application uses Supabase for authentication and the database, and Vercel for web hosting. The inspected Supabase project is in the `us-east-1` region in the United States. Other processing destinations, processors and agreements need confirmation before this policy is published.

Google Books receives confirmed search text. When displaying a cover, the server requests the image from its provider. The browser requests covers through Tinteruna's authenticated intermediary. Fonts are prepared during the build and served with the application.

The repository contains an authentication email integration with Brevo. The active delivery provider and its processing must be verified in production before being described as an established practice.

### Your rights and how to exercise them

You can request access, updates or correction, obtain a copy of information concerning you, ask about its use, request evidence of authorization, and request deletion or withdrawal where applicable. You can also contact Colombia's Superintendence of Industry and Commerce under the applicable legal procedures.

Write to the operator's privacy email from your account email and describe your request. Keep passwords and access codes private. The operator must verify identity proportionately and respond within applicable legal deadlines. The operational procedure and the time limits communicated to users need completion before publication.

You can edit annotations and delete books in the library. The data page offers a JSON copy of books, notes, quotations, goals and basic account information. Account closure, deletion across associated systems, and retention and backup periods require the pending operating procedure.

### Adolescents

The intended audience includes people older than 14. Processing data about people who are still minors requires the safeguards applicable in Colombia. Before enabling that journey, Tinteruna must implement verifiable authorization from the legal representative and the adolescent's right to be heard, considering maturity, autonomy and best interests.

### Policy changes

Each approved publication must show a version and effective date. Changes to purposes or conditions that require renewed authorization must be communicated and processed before the corresponding processing occurs.

## Terms of use

Tinteruna provides a personal reading library. The operator and contact channel will be loaded from the private variables described in the privacy notice. Initial launch is intended for Colombia and people older than 14, with the representative-authorization and minor-protection process still requiring implementation for adolescents.

You are responsible for protecting your credentials and using the service with information you may lawfully store. Respect other accounts, third-party rights and technical protections. Unlawful content, unauthorized access and attempts to bypass controls are prohibited.

You retain rights in your original notes and writing. Operating the library requires limited permissions to store, process and display that content and act on your instructions. The scope and grounds of processing must be approved before the terms are published.

Covers and metadata may come from third parties, whose rights continue to apply. Rights holders can use the contact channel for correction or removal requests. Reviewing Google Books and image-provider terms is part of launch preparation.

The service depends on connections and providers that can experience interruptions. The final terms must explain service changes, limitations and incident handling proportionately while respecting users' legal rights.

User-requested closure and suspension for misuse need a defined procedure covering reasons, complaints and data handling. Those procedures require operational validation and legal review.

## Cookies and storage information

The application uses Supabase SSR cookies for sessions and authentication. The repository's application code does not include an analytics or advertising SDK or write application data to `localStorage` or `sessionStorage`.

Actual platform configuration, cookies and lifetimes must be checked in an authenticated session. Any future optional tracking requires assessment and appropriate separate choices. This draft describes the current inventory and its verification gaps.

## Sources for review

- [Law 1581 of 2012, Ministry of ICT compilation](https://normograma.mintic.gov.co/mintic/compilacion/docs/ley_1581_2012.htm)
- [Decree 1074 of 2015, Articles 2.2.2.25.2.9 and 2.2.2.25.3.1](https://normograma.mintic.gov.co/mintic/compilacion/docs/decreto_1074_2015.htm)
- [SIC guidance on exceptional processing and representative authorization](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/tratamiento-excepcional-y-autorizacion-del-representante-legal-con-interes-superior)
- [SIC guidance on authorization and privacy-policy acknowledgment](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/boletin/el-silencio-las-casillas-premarcadas-por-defecto-y-la-inaccion-no-constituyen-el-consentimiento-conforme-con)
- [Google Books API terms](https://developers.google.com/books/terms)
