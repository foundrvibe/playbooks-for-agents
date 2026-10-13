# Market size

Use this for market size, growth, trends, and industry classification. Research the playbook's `market_country` and scope figures to its `target_region` when the playbook provides one. National tables use the country; SAM and segments apply the city, province, state, or metro filter. Do not mix countries in one figure.

## How to find counts

Use **web search**, then open the pages it returns. Search in plain language, for example the industry name plus `establishments`, `businesses`, or the NAICS code plus `count` and the country.

- Prefer **HTML pages** you can read in the browser: labor statistics handbooks, agency program pages with published tables, statistics office data tables, industry association reports, and government press releases. Cite the exact URL you opened.
- **Do not** use the U.S. Census Bureau Data API, `api.census.gov`, or any statistics **API that needs a key**. Do not tell the user to sign up for an API. If a count appears only behind an API, web-search for the same release as a table or PDF on the agency site and open that instead.
- When search surfaces several numbers, open the highest-ranked official source from [source-evaluation.md](source-evaluation.md). Say which page you used.
- Jobs (employees) and establishments (firms) are different units. Do not multiply jobs by price per firm unless the product is sold per employee.

## Where to look

1. **Classify the industry.** Find the NAICS code (North America) or the national equivalent, such as NACE in the EU or SIC in the UK. Web-search the code or industry name, then open the official code search, such as the [U.S. Census NAICS search](https://www.census.gov/naics/) or [Statistics Canada NAICS](https://www.statcan.gc.ca/en/subjects/standard/naics/2022/v1/index).
2. **Count the businesses you sell to.** Web-search for establishment or firm counts for that code, then open the agency page or table:
   - Canada: [Canadian Business Counts](https://www.statcan.gc.ca/en/statistical-programs/document/1105_D16_V4). Use the latest semi-annual "with employees" table, which breaks counts down by NAICS, province, and employment size. The table number changes with each release.
   - United States: [County Business Patterns](https://www.census.gov/programs-surveys/cbp.html) overview and tables linked from search—not the Data API.
   - European Union: [Eurostat structural business statistics](https://ec.europa.eu/eurostat/web/structural-business-statistics).
   - United Kingdom: [ONS UK business: activity, size and location](https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation).
   - United States (workforce context): [Bureau of Labor Statistics Occupational Outlook Handbook](https://www.bls.gov/ooh/) for employment and industry mix when establishment tables are hard to find—label the unit clearly.
3. **Find growth and trends.** Use national statistics releases, government industry profiles, and industry associations for the customer's trade. Use public company annual reports when large players file them.
4. **Use trade press last.** Use it for trends, not for the market-size figure itself.

## How to size

- Prefer bottom-up sizing: number of target businesses × a cited or assumed annual price. Show the multiplication.
- **TAM** is every buying unit that could use this kind of product × annual revenue per unit.
- **SAM** keeps only the units this product can serve now: the country, the size band, the segment, and the channel it can reach.
- **SOM** is the customers this company can win within a stated time, from its channel capacity or a count you opened. It is never a percent of TAM.
- Give a low, base, and high value when a key input is assumed, and name the input that moves it most.
- A top-down figure from a paid research firm may be quoted only when the figure is visible on the cited page. Use it to sanity-check the bottom-up figure, not to replace it.
- Do not add counts that measure different things, such as establishments and firms. See [source-evaluation.md](source-evaluation.md).
- Say the year each figure is for. Prefer figures from the last three years.
- Put any multiplication or price you chose in Assumptions.

## Record

Add each page you opened to `sources` with title, publisher, URL, and the date you opened it.
