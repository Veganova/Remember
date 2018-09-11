import Fuse from 'fuse.js';


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

function doesParentExist(star, listOfStars, byParentId, orignalStar) {
  console.log({ orignalStar , listOfStars });
  if (listOfStars.filter(cur => cur["_id"] === star.parentId).length > 0) {
    console.log(true);
    return true;
  }
  if (star.parentId === star.userId) {
    console.log(false);
    return false;
  }
  for (let i = 0; byParentId[star.parentId].length; i++) {
    if (doesParentExist(byParentId[star.parentId][i], listOfStars, byParentId, orignalStar)) {
      return true;
    }
  }
  return false;
}

function search(stars, search) {
  if (!search) {
    return stars;
  }
  var options = {
    keys: [{
      name: 'data'
    }],
    threshold: 0.3
  };
  const fuse = new Fuse(stars, options);

  const result = fuse.search(search);
  return result;
}

export function _searchAndFormatStars(searchTerm, unformatedData) {
  searchTerm = "asd";
  const allStars = unformatedData;
  const byParentId = getByParentId(allStars);

  const acc = [];
  const searchResult = search(allStars, searchTerm);
  const filteredSearch = searchResult.filter(cur => doesParentExist(cur, searchResult, byParentId, cur));
  console.log({ filteredSearch });


  for (let i = 0; i < searchResult.length; i++) {
    let temp = formatStars(searchResult[i]["_id"], allStars);
    acc.concat(temp);
  }

  return acc;
}

function markFormattedStars(star, searchResult, acc) {
  if (searchResult.filter(cur => cur["_id"] === star.id).length > 0) {
    acc.push(star);
    return;
  }
  star.childStars.forEach(cur => markFormattedStars(cur, searchResult, acc));
}



export function searchAndFormatStars(searchTerm, unformatedData, userId) {
  const allStars = unformatedData;
  const byParentId = getByParentId(allStars);
  const searchResult = search(allStars, searchTerm);
  const formatedStars = formatStars(userId, allStars);
  const userStar = {
    id: userId,
    childStars: formatedStars
  };
  const acc = [];
  markFormattedStars(userStar, searchResult, acc);


  for (let i = 0; i < acc.length; i++) {
    acc[i].parentId = "a";
  }
  const searchResultStar = [{
    index: 0.5,
    userId: userId,
    id: "a",
    "_id": "a",
    data: "Search Results",
    parentId: userId,
    childStars: acc,
    addDisabled: true,
  }];

  console.log(searchResultStar);

  return formatedStars.concat(searchResultStar);
}