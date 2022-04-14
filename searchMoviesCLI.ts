const { question } = require("readline-sync");

const { Client } = require("pg");

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: 'omdb' });
console.log("Welcome to search-movies-cli!");

async function execute(){
    console.log("Hello user")

    try{
        await client.connect()
        console.log('connected succesfully to omdb')
        while (true) {
            const userPrompt = question('Search for a movie, or q to quit: ');
            if (userPrompt === 'q'){break}
            else{
                const text = "select id, name, date, runtime, budget, revenue, vote_average, votes_count from movies where lower(name) like $1 order by date desc limit 20";
                const values = [`${userPrompt}`]
                const results = await client.query(text, values)
                console.table(results.rows)

            }


        
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