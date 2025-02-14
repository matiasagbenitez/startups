import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import SearchForm from "@/components/SearchForm";

// * For cached data
// import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";

// * For live data
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const params = { search: query || null };

  // * For cached data
  // const posts = await client.fetch(STARTUPS_QUERY);

  // * For live data
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <div>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect with Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches and Get Noticied in Virtual Competitions
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard, key: number) => (
              <StartupCard key={key} post={post} />
            ))
          ) : (
            <p>No posts found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </div>
  );
}
