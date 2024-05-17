import Image from "next/image";

async function getData(slug) {
  try {
    const response = await fetch(
      `https://api.trakt.tv/movies/${slug}?extended=full`,
      {
        headers: {
          "Content-type": "application/json",
          "trakt-api-version": 2,
          "trakt-api-key": process.env.CLIENT_ID,
        },
      }
    );

    const movieData = await response.json();

    // Fetch the image URLs for the movie
    const imageResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieData.ids.tmdb}/images`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ID}`,
        },
      }
    );

    const imageData = await imageResponse.json();
    // Filter for non-portrait images (backdrops)
    const landscapeImages = imageData.backdrops;

    const movieWithImage = {
      ...movieData,
      imageUrl:
        landscapeImages.length > 0 ? landscapeImages[0].file_path : null, // Get the first landscape image
    };

    return movieWithImage;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function MovieDetails({ params }) {
  const data = await getData(params.slug);

  console.log(data);

  if (!data) {
    return <div>Error loading movie details.</div>;
  }

  return (
    <div className="movie-details ">
      {data.imageUrl && (
        <div className="relative w-full h-72 rounded-b-xl overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${data.imageUrl}`}
            alt={data.title}
            fill
            className="object-cover object-center"
          />
        </div>
      )}
      <div className="px-5 pt-3 space-y-5">
        <h1 className="text-indigo-600 text-2xl font-bold">{data.title}</h1>
        <p className="">{data.overview}</p>
        <p>{data.year}</p>
        {console.log(data)}
      </div>
    </div>
  );
}
