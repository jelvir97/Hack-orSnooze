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
        <span>&#9734;</span>
        <div class="story-info">
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a> 
        
          <small class="story-hostname">(${hostName})</small>
          <div class="story-author">by ${story.author}</div>
          <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
      <hr>
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

    const $id = $story.attr('id')
    const $star = $(`#${$id} span`)
    if(currentUser && checkFavorite($id)){
      $star.addClass('favorite')
      $star.html('&#9733;')
    }
  }
  $allStoriesList.show();
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoriteStoriesList.empty();
  $favoriteStoriesList.append('<h4>Favorites</h4>');
  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);

    const $id = $story.attr('id')
    const $star = $(`#favorite-stories-list #${$id} span`)

    if(checkFavorite($id)){
      $star.addClass('favorite')
      $star.html('&#9733;')
    }
  }
  $favoriteStoriesList.show();
}

function putUserStoriesOnPage(userStoryList) {
  console.debug("putUserStoriesOnPage");

  $userStoriesList.empty();
  $userStoriesList.append('<h4>Your Stories</h4>');
  // loop through all of our stories and generate HTML for them
  for (let story of userStoryList) {
    const $story = generateStoryMarkup(story);
    $userStoriesList.append($story);
    $story.append('<button>Remove</buttom')
    const $id = $story.attr('id')
    const $star = $(`#user-stories-list #${$id} span`)
    console.log($star);
    if(checkFavorite($id)){
      $star.addClass('favorite')
      $star.html('&#9733;')
    }
  }
  $userStoriesList.show();
}

async function handleAddStorySubmit(evt){
  evt.preventDefault();
  const newStory = {title: $('#story-title').val(), author: $('#story-author').val(),url: $('#story-url').val()}
  await storyList.addStory(currentUser, newStory);
  $addStoryForm.trigger("reset");
  hidePageComponents();
  putStoriesOnPage();
}

$addStoryForm.on('submit', handleAddStorySubmit);

async function handleFavoriteClick(evt){
  console.log(evt.target.parentElement.id)
  const targetID = evt.target.parentElement.id;

  if(checkFavorite(targetID)){
    await currentUser.removeFavoriteStory(targetID)
    $(evt.target).removeClass('favorite')
    $(evt.target).html('&#9734;')
  }else{
    await currentUser.addFavoriteStory(targetID)
    $(evt.target).addClass('favorite')
    $(evt.target).html('&#9733;')
  }
}

$allStoriesList.on('click','span', handleFavoriteClick)

$favoriteStoriesList.on('click','span', async function(evt){
  await handleFavoriteClick(evt)
  putFavoritesOnPage()
})

$userStoriesList.on('click','span', async function(evt){
  await handleFavoriteClick(evt)
  userStories();
})

async function handleRemoveStoryClick(evt){
  evt.preventDefault();
  const id = evt.target.parentElement.id;
  await storyList.removeStory(id);
  storyList = await StoryList.getStories();
  userStories();
}
$userStoriesList.on('click', 'button', handleRemoveStoryClick);

function checkFavorite(id){
  const favIds = currentUser.favorites.map(story => story.storyId)
  return favIds.includes(id);
}

function userStories(){
  const userStoryList = storyList.stories.filter((story) => story.username === currentUser.username);
  console.log(userStoryList);
  putUserStoriesOnPage(userStoryList);
}


