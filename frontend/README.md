
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
- To store cookies in bowser as it need to be https but our localhost is http so  config->orign and credentials as true on the backend
- while making api call with axios do add {withCrendtial:true}
- Install React-Redux and Toolkit
- created store ->configureStore and slice->userSlice->CreateSlice
- Login and try if user data comes in
- With User data made the header dynamic change avatar image and added user full name
- created constant in utils and stored BASE_URL 

# Routes
Body
    Route="/" -> "Feed" -> Get All Videos
    Route="/login" -> Login
    Route="/signup" -> Signup