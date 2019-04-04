var request = require("request")

let usedParams = [];

function welcome(req, res) {
    res.render("landing")
}

function getNews(req, res){
    let country = req.body.country
    let category = req.body.category
    let keyword = req.body.keyword;

    // Code to prevent user from making API call using same parameters within 30 seconds. =================================================

    let params = {
        country,
        category,
        keyword
    }
    let flag = 0;
    if(usedParams.length == 0) {
        usedParams.push(params);
            setTimeout(function(){
                var index = usedParams.indexOf(params);
                if (index > -1) {
                usedParams.splice(index, 1);
                }
            }, 30000)
    } else {
        usedParams.forEach(x => {
            if(x.country == params.country && x.category == params.category && x.keyword == params.keyword){
                flag++;
                res.render("error", {message: "You cannot use same parameters if you have already used these parameters within the last 30 seconds."})
            } 
        })
        if(flag == 0){
            usedParams.push(params);
            setTimeout(function(){
                var index = usedParams.indexOf(params);
                if (index > -1) {
                usedParams.splice(index, 1);
                }
            }, 30000)
        }       
    }

    //=========================================================================================================================================



    // Code to fetch data from API=============================================================================================================

    var url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&q=${keyword}&apiKey=eadb6da4bb5847a8b5f5b8a633e53ab9`


    function initialize() {
        var options = {
            url
        };
        return new Promise(function(resolve, reject) {
            request.get(options, function(err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    }
    
    initialize().then(function(data) {
        if(data.status == "error") {
            res.render("error", {message: data.message})
        } else {
            if(data.totalResults == 0) {
                res.render("error", {message: "No results found!"})
            }
            var JSON_To_Display = data.articles.map(obj => {
                return {
                    country: country,
                    category: category,
                    keyword: keyword,
                    title: obj.title,
                    description: obj.description,
                    sourceURL: obj.url,
                    title: obj.title
                }
            })
            res.json(JSON_To_Display)    
        }
    });
}

//====================================================================================================================================================

module.exports = {
    getNews,
    welcome
}