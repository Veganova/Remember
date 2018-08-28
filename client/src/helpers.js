function getByParentId(allStars) {
  const byParentId = {};
  allStars.forEach((star) => {
    if (!byParentId[star.parentId]) {
      byParentId[star.parentId] = [];
    }
    if (!byParentId[star['_id']]) {
      byParentId[star['_id']] = [];
    }
    byParentId[star.parentId].push(star);
  });
  return byParentId;
}

/**
*   Needs there to be a mapping for every single star id (below the parentId) -> list of children stars
**/
export function constructStars(byParentId, parentId) {
  const stars = [];
  const parentStars = byParentId[parentId];

  parentStars.forEach((parentStar) => {
    const childStars = constructStars(byParentId, parentStar['_id']);
    const copy = JSON.parse(JSON.stringify(parentStar));
    copy.id = copy["_id"];
    copy.childStars = childStars;
    stars.push(copy);
  });

  return stars;
}

export function formatStars(userId, unformatedData) {
  const allStars = unformatedData;
  const byParentId = getByParentId(allStars);
  return constructStars(byParentId, userId);
}
