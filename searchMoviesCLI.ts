const { question } = require("readline-sync");

const { Client } = require("pg");

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: 'omdb' });
console.log("Welcome to search-movies-cli!");

async function execute(){

    try{
        await client.connect()
        console.log('connected succesfully to omdb')
      
        let a = true;
        while (a) {
            const userPrompt = question("Choose from the following options: [1] Search Movies, [2] See Favourites, [3] quit: ");
            if (userPrompt === '3'){a = false;}
            else if(userPrompt === '1'){
                // if search given search movies table for match
                const searchTerm = question("Search for a movie: ");

                const text = "select id, name, date, runtime, budget, votes_count, vote_average, revenue from movies where lower(name) like $1 and kind = 'movie' order by date desc limit 10";
                const values = [`%${searchTerm}%`];
                const results = await client.query(text, values)
                console.table(results.rows)
                // // select favourites
                let selectFavourite = parseInt(question("Enter a movie's index number to add to favourites, or press any other key to return to main menu: "));
                if (selectFavourite <10 && selectFavourite>=0){
                    const favText = `insert into favourites(movie_id) select id from movies where lower(name) like $1 and kind = 'movie' order by date desc limit 1 offset ${selectFavourite}`;
                    const favResults = await client.query(favText, values);
                };

                }

            else if (userPrompt === '2'){
                const showFavText = "select movies.id, movies.name, movies.date, movies.runtime, movies.budget, movies.revenue from favourites join movies on favourites.movie_id = movies.id"
                const favs = await client.query(showFavText);
                if (favs.rows.length === 0){
                    console.log("No favourites yet! Search movies to add to favourites")
                }
                else{
                console.table(favs.rows)}

            };





        


        
        }
    
    }
    catch(ex){
        console.log(`Something went wrong ${ex}`)
    }
    finally{
        await client.end()
        console.log("client disconnect succesfully")
    }
}

execute();