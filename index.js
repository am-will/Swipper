const tweetsData = window.tweetsData || []
const uuidv4 = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback if crypto.randomUUID is missing; relies on Math.random.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

document.addEventListener('keydown', (e) => {
  if (e.target.id === 'tweet-input' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    document.getElementById('tweet-btn').click()
    }
    else if (e.target.classList.contains('reply-input') && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.target.closest('.reply-text').querySelector('.send-reply').click();
    }
})

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'replyto'){  
        handleReplytoClick(e.target.dataset.replyto)
    }
    else if(e.target.id === 'close-btn') {
        handleCloseClick(e.target.dataset.close)
    }
    else if (e.target.closest('.send-reply')) {
      handleReplyBtnClick(e.target.closest('.send-reply'));
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplytoClick(replyId){
    document.getElementById(`replyto-${replyId}`).classList.toggle('hidden')
}

function handleReplyBtnClick(btn) {
  const wrapper = btn.closest('.reply-text')
  const replyId = wrapper.id.replace('replyto-', '')
  const input = wrapper.querySelector('.reply-input')
  const text = input.value.trim()
  if (!text) return

  const tweet = tweetsData.find(t => t.uuid === replyId)
  if (!tweet) return

  tweet.replies.unshift({
    handle: '@Godzilla',
    profilePic: 'images/godz.webp',
    likes: 0,
    retweets: 0,
    tweetText: text,
    replies: [],
    isLiked: false,
    isRetweeted: false,
    uuid: uuidv4()
  });

  input.value = ''
  render()
  document.getElementById(`replies-${replyId}`)?.classList.remove('hidden')
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Godzilla`,
            profilePic: `images/godz.webp`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

// function handleCloseClick(closeId){
//   document.getElementById(`tweet-${closeId}`)?.classList.add('hidden');
// }

function handleCloseClick(closeId){
    document.getElementById(`tweet-${closeId}`).classList.toggle("hidden")
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        // let openReply = false
        
        
        
          
        feedHtml += `
<div class="tweet" id="tweet-${tweet.uuid}">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="btn-container">
                <p class="handle">${tweet.handle}</p>
                <i class="fa-solid fa-xmark"
                data-close="${tweet.uuid}" id="close-btn"></i>
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-solid fa-reply replyto"
                    data-replyto="${tweet.uuid}" id="replyto"
                    ></i>
                </span>
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden reply-text" id="replyto-${tweet.uuid}">
        <textarea placeholder="What's your reply?" class="reply-input"></textarea>
        <button class="send-reply">Reply</button>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
