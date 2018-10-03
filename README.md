#### A simple note taking app.

### Technology Overview:

The project uses React-Redux on the front end and NodeJS/ExpressJS on the back end. 

Data is handled using mongoose and there is different modes for DEV and PROD.

The project is built using [create-react-app](https://github.com/facebook/create-react-app) which sets up a boilerplate React app.
 


##### Local project setup:
1. Clone the repo 
2. Run `npm install`
3. `cd client`
4. Run `npm install`
5. Make a file config/dev.js and fill in values

    i. Copy keys from prod.js
     
    ii. Make a Google+ API key (for OAuth2) and fill in `googleClientID` and `googleClientSecret`
     
    iii. Make a database and fill in the `mongoURI` (we use mlab)
     
    iv. Fill in a random string for which is used by `passport.js` for user session cookies
     
6. Run the project locally. (Run from top level directory)
```sh
cd ..
npm run dev 
```

#### Terminolgy
The project uses the term 'star' which can be thought of as a note with added metadata. Each star has a `parentId` ([star model](models/Star.js)) which allows the front end to format the data into a tree.

The backend API endpoints are specified at [starRoutes](routes/starRoutes.js).

