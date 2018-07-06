### PAPI - chrome extension to check consistency of backend APIs 
Helps to debug the issue when fronend breaks during page reloads.
Shows if any APIs response or header has changed.

#### motivation
A couple of times I ran into an issue where frontend application state was changing on reloading of the page. Need to track down if it was a frontend bug or APIs were not consistent. So created this extension to double check the API.

![demo](./demo.gif)

### Install
I will publish this to chromestore soon and update the link here

#### todos  
- [ ] pulish to chrome app store
+ [ ] compare headers  
- [ ] give filtering option  
+ [ ] let the user choose the response types

### credits
icon by [creativestall from thenounproject](https://thenounproject.com/creativestall/)  
[https://github.com/mooring/chrome-extensions](https://github.com/mooring/chrome-extensions) used this get started with.  
Used [deep-diff](https://github.com/flitbit/diff/) to generate json response diff  

### license
MIT
