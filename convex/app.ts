import { query } from "./_generated/server";

export const getDogs = query(async ({ db, storage, auth }) => {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated call to getDogs");
  }

  const user = await db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
  if (!user) {
    throw new Error("Unauthenticated call to getDogs");
  }

  const myDogs = await db
    .query("dogs")
    .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
    .collect();

  return Promise.all(
    myDogs.map(async (dog) => ({
      ...dog,
      ...(dog.file ? { url: await storage.getUrl(dog.file) } : {}),
    }))
  );
});

export const getDogSummary = query(async ({ db }) => {
  const allDogs = await db.query("dogs").collect();
  const countByLocation: { [k in string]: number } = {};
  for (const dog of allDogs) {
    const loc = dog.location;
    if (!countByLocation[loc]) {
      countByLocation[loc] = 1;
    } else {
      countByLocation[loc] += 1;
    }
  }

  const byLocation = [];
  for (const location of Object.keys(countByLocation)) {
    byLocation.push({ location, count: countByLocation[location] });
  }
  return {
    count: allDogs.length,
    byLocation,
  };
});
