### Developed this app as part of the Sabre India Bootcamp Hackathon 2022.

The problem statement was to develop an app that symbolizes travel in the future, and we chose to develop a solution that involved gamifying travel.

When you open Amazon, you have the urge to buy something. But, when you open Redbus or MakeMyTrip, you don't really have the urge to travel. This is where Ghumo comes into the picture and tries to create this urge to travel.

Ghumo is the travel buddy you always wished you had! It provides users with a unique chance to create their own travel plans based on the experiences shared by other Ghumo users. It simplifies the **planning** part, and helps focus only on the **travel** part.

**Various features provided by Ghumo:**

1. Secure login and register with hashed passwords.
2. Choose between multiple popular destinations for your next travel destination. A search filter is also present to help users get results faster.
3. View itineraries created by other users, classified by location, and the points obtained for the itinerary.
4. Upload your own itinerary for the locations available, and get a chance to move up the leaderboard.
5. View the leaderboard - a unique competitve system that keeps travellers excited and creates the urge to travel.

The leaderboard system ensures that quality itineraries are available to all users. It also gives travel bloggers/vloggers a chance to reach out to their target audience and become influencers on the Ghumo platform.

**Tech Stack Used:**

1. HTML
2. CSS
3. JS
4. NodeJS
5. Express
6. MongoDB

MongoDB Atlas was used for a cloud based database environment, and the entire project was dockerized and deployed on GCP.

You can access the website at [Ghumo](https://ghumo-rjjg3allbq-el.a.run.app/)

If the deployed application is unavailable/taken down, you can locally run the app following the below steps:

1. Clone the git repository onto your local system. Ensure you have node and npm installed.
2. Run the command `npm install` to download all the dependencies.
3. Change the DB_PASSWORD field in the index.js file to connect with your own database.
4. Run `npm run start` or `npm run dev` and the application should be good to go on localhost.
