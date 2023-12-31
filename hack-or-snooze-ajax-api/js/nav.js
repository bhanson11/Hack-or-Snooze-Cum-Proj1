"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitNewStoryClick(evt) {
  console.debug("navSubmitNewStoryClick", evt);
  hidePageComponents();
  const submitForm = document.getElementById("submit-form");
  submitForm.classList.remove("hidden");
  $allStoriesList.show(); 
}

$navSubmitNewStory.on("click", navSubmitNewStoryClick);

// Show favorite stories on click on "favorites" in nav
function navFavsClick(evt) {
  console.debug("navFavsClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on("click", "#nav-favorites", navFavsClick);

//Show Users stories on clicking "my stories" on nav
function navMyStoriesClick(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStoriesClick);