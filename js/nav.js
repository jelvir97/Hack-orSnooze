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

function navAddStory(evt){
  evt.preventDefault();
  hidePageComponents();
  console.log($addStoryForm)
  $addStoryForm.show();
}
$navAddStory.on('click', navAddStory);

function navFavorites(evt){
  evt.preventDefault();
  hidePageComponents();
  putFavoritesOnPage();
  $favoriteStoriesList.show();
}

$navFavorites.on('click', navFavorites);

function navUserStoriesClick(evt){
  evt.preventDefault();
  hidePageComponents();
  userStories();
  $userStoriesList.show();
}

$navUserStories.on('click', navUserStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navAddStory.show();
  $navFavorites.show();
  $navUserStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
