# ShareTube - Frontend

- Create a Vite + React application
- Removed unecessary code
- Installed Tailwind CSS
- Installed React Router
- Created BrowserRouter -> Routes ->Route
- Created a Route with path "/" with element as Body component
- In Route "/" created a nested Route of "/login"
- In Body Component used "Outlet" to make the children Route to attached dynamically
- Login and Signup page CSS with their route
- install axios
- Implement post method on Login and Signup
- CORS -solving cors issue in frontend by using cors in backend with config->orign and credentials as true
- To store cookies in bowser as it need to be https but our localhost is http so config->orign and credentials as true on the backend
- while making api call with axios do add {withCrendtial:true}
- Install React-Redux and Toolkit
- created store ->configureStore and slice->userSlice->CreateSlice
- Login and try if user data comes in
- With User data made the header dynamic change avatar image and added user full name
- created constant in utils and stored BASE_URL
- fetched User info data from Body component
- update from user info with this userinfo call
- now as user data is stored in store on refresh the value are present
- Also redirect the user is info is not fetched
- Added Logout button
- While POST on Logout call make sure u have give {withCredential:true,headers: {Accept: "application/json",
"Content-Type": "application/json",}}
- Fetched All Video at '/'->Feed component and store in a new slice ->videoSlice
- displayed video Thumbnails on the feed page
- Linked the videos from feed to /watch?v=1234 page
- Displayed Video on the /watch page4
- Made Video Deatils(Channel avatar,video title+description,like,subscribed+count) on the present page
- Added Descripiton Div 
- updated backend to get is Current user is subscribed to the channel and also is user has liked the video already
- Also fix the issue in getting user liked videos from the backend ->which was returning only the 1 video(due to  backend returning video[0] object)
- Implement Subscriber count,like count and they are dynamic with number shown on the frontent
- Subscriber and like count changes in the backend
- Clean up the code by creating Custom Hook for all the components (Body,Header,Login,signup,VideoFeed)
- Seperate components for videoCard and videoDescription
- Create a VideoComment component use CommentCard 
- Implement getting the video comments and user can add comments to the video
- Inegerated Sidebar to each of the route
- created Comment Slice to store comment with adding new comment,get all comments ,removing all the comments and delete a particular comment
- Completed comment part -> created comment,display comment,delete and edit by the current user with dynamic render
- created You page conatins user Library (history,liked videos,playlist)
- Implemented History part (used the VideoCard Component) for showing watched videos
- Implemented Liked part
- Implemented Playlist part in user library contains users playlist
- Also created /playlist route(just added to route)
- Implemented Playlist page which fetch the playlist and shows all the video present(edit,delete and adding options remaing)
- Implement adding video to playlist option to each video card,user can add video to its created playlist
- Implement delete and edit playlist option
- Implemented Editing playlist details, created editPlaylist reducer in library->playlist slice ,used .find() methid to find the matching playlistId and modified it details(title,description)
- Also implemented creating new Playlist,created addCreatedPlaylist reducer in library->playlist slice which push a playlist to exisiting playlist array
# Routes

Body
Route="/" -> "Feed" -> Get All Videos
Route="/login" -> Login
Route="/signup" -> Signup
Route="/watch?v=videoId -> Watch Video
Route="/you" -> user library page(contains liked videos,history and playlist)
Route="/playlist" -> 
