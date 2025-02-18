import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import SearchForm from "@/components/SearchForm";

// * For cached data
// import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";

// * For live data
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const params = { search: query || null };
  const session = await auth();

  // * For cached data
  // const posts = await client.fetch(STARTUPS_QUERY);

  // * For live data
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <div>
      <section className="pink_container">
        <h1 className="heading">
          Presenta tu idea, <br /> Conviértela en realidad
        </h1>
        <p className="sub-heading !max-w-3xl">
          Comparte tu idea y conecta con otros emprendedores para hacerla
          realidad.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Resultados de búsqueda para "${query}"` : "Todas las ideas"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard, key: number) => (
              <StartupCard key={key} post={post} />
            ))
          ) : (
            <p>
              {query
                ? `No se encontraron resultados para "${query}"`
                : "No hay ideas publicadas"}
            </p>
          )}
        </ul>
      </section>

      <SanityLive />
    </div>
  );
}
