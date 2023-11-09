"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, then show fav/not fav star for input to favs list
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? starFavHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//make delete button HTML 
function getDeleteBtnHTML() {
  return `
  <span class="trash-can">
    <i class="fas fa-trash-alt"></i>
  </span>`;
}

//make favorite and star or unstar story
function starFavHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
  <span class="star">
    <i class="${starType} fa-star"></i>
  </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//handle deleting a story 
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list with that story deleted
  putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

//submitting new Story form
async function addNewStory(evt) {
  console.debug("addNewStory");
  evt.preventDefault();
  
  // grab info from form for story
  const title = $("#add-title").val();
  const url = $("#add-url").val();
  const author = $("#add-author").val();
  const username = currentUser.username
  const storyData = { title, url, author, username }; 

  const story = await storyList.addStory(currentUser, storyData); 
  
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story); //prepend to add story to the top of the page 

  // hide the form and reset 
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", addNewStory);

// List of user's own stories: 

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

//list of favorites to star and un-star a story

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

async function toggleFavoriteStar(evt) {
  console.debug("toggleFavoriteStar");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  //see if the story is already a favorite (check for presence of fav star)
  if ($tgt.hasClass("fas")) {
    //currently a fav so remove it from the list an unstar
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    //currently not a fav so add it to favs list and star
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavoriteStar);