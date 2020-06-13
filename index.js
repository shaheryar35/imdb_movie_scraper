const cheerio= require('cheerio');
const requestPromise= require('request-promise');
const fs= require('fs');
const { Parser } = require('json2csv');
const request= require('request');
const URLs= [
    {url: 'https://www.imdb.com/title/tt0102926/',
    id:'the_sclience_of_lamb'
        },
        {
            url: 'https://www.imdb.com/title/tt2267998/',
            id:'gone_girls'
        }    
        ];

(async()=>{
    let movies_data=[];
    for( let movies of URLs){
    const response= await requestPromise({
        uri:movies.url,
        headers:{
            'authority': 'www.imdb.com',
            'method': 'GET',
            'path': '/title/tt0102926/?ref_=vp_back',
            'scheme': 'https',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-HK,en-US;q=0.9,en;q=0.8',
            'cache-control': 'max-age=0',
            'referer': 'https://www.imdb.com/video/vi3377380121?playlistId=tt0102926&ref_=tt_ov_vi',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Mobile Safari/537.36'
                    },
            gzip:true
       
  
    })
    let $ = cheerio.load(response);
    let title= $('div[class="title_wrapper"] > h1').text().trim();
    let rating= $('span[itemprop="ratingValue"]').text();
    let poster= $('div[class="poster"] > a > img').attr('src');
    let totalRatings= $('a[href="/title/tt0102926/ratings?ref_=tt_ov_rt"] ').text();
    let releaseDate= $('a[title="See more release dates"]').text().trim();
    //let popularity= $('#title-overview-widget > div.plot_summary_wrapper > div.titleReviewBar > div:nth-child(5) > div.titleReviewBarSubItem > div:nth-child(2) > span').text();


    let geners=[]
    $('div[class="subtext"] > a' ).each((index,element)=>{
        let gener= $(element).text();
        geners.push(gener);

    })


    console.log("Title:"+title);
    console.log("Rating:"+rating);
    console.log("Poster:"+poster);
    console.log("Total Rating:"+totalRatings);
    console.log("Release Date:"+ releaseDate);
    console.log("Gerers:"+geners);
    movies_data.push({
    title,
    rating,
    poster,
    totalRatings,
    releaseDate,
    geners
        });
    //const json2csvParser = new Parser();
   // const csv = json2csvParser.parse(movies_data);
    //    fs.writeFileSync('./data2.csv',csv,'utf-8');
    //    console.log(csv);
    
    let file= fs.createWriteStream(`${movies.id}.jpg`);
    await  new Promise ((resolve,reject)=>{
        let streem= request({
            uri:poster,
            headers:{
                'authority': 'www.imdb.com',
                'method': 'GET',
                'path': '/title/tt0102926/?ref_=vp_back',
                'scheme': 'https',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-HK,en-US;q=0.9,en;q=0.8',
                'cache-control': 'max-age=0',
                'referer': 'https://www.imdb.com/video/vi3377380121?playlistId=tt0102926&ref_=tt_ov_vi',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Mobile Safari/537.36'
    
            },
            gzip:true
        }).pipe(file)
        .on('finish',()=>{
            console.log(`${movies.id} Image Downloaded Success`);
            resolve();
        })
        .on('error',(error)=>{
            reject(error);
        })
    

    }).catch(error=>{
        console.log(`${movies.id} has error on Downlaod ${error}`);
    })
   

}})()


