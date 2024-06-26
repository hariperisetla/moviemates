"use server";

export async function getPersons(slug) {
  try {
    // Fetch cast details from Trakt
    const response = await fetch(`https://api.trakt.tv/movies/${slug}/people`, {
      headers: {
        "Content-type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.CLIENT_ID,
      },
    });

    const personsData = await response.json();

    // Fetch image URLs for each person in the cast from TMDB
    const castWithImages = await Promise.all(
      personsData.cast.map(async (person) => {
        try {
          const personResponse = await fetch(
            `https://api.themoviedb.org/3/person/${person.person.ids.tmdb}?api_key=${process.env.TMDB_ID}&append_to_response=images`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_ID}`,
              },
            }
          );

          const personData = await personResponse.json();

          // Select the profile image if available
          const profileImage =
            personData.images.profiles.length > 0
              ? personData.images.profiles[0].file_path
              : null;

          return {
            ...person,
            profileImageUrl: profileImage,
          };
        } catch (error) {
          console.error(
            `Error fetching image for person ${person.person.ids.tmdb}: `,
            error
          );
          return person; // Return the person object without the profile image
        }
      })
    );

    return castWithImages;
  } catch (error) {
    console.error("Error fetching persons: ", error);
    return null;
  }
}
