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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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

async function addNewStory(evt) {
  console.debug("addNewStory");
  evt.preventDefault();
  
  // grab info from form for story
  const title = $("#add-title").val();
  const url = $("#add-url").val();
  const author = $("#add-author").val();
  const username = currentUser.username
  const storyData = { title, url, author, username }; 

  const story = await storyList.addStory(currentUser, storyData).catch(function (error) {
    console.error("Error adding story:", error);
  });
  // const story = await storyList.addStory(currentUser, storyData); 
  
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

  $usersOwnStories.empty();

  if (currentUser.ownStories.length === 0) {
    $usersOwnStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.usersOwnStories) {
      let $story = generateStoryMarkup(story, true);
      $usersOwnStories.append($story);
    }
  }
  $usersOwnStories.show();
}

//list of favorites to star and un-starr a story

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

