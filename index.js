const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movieData = [];

const movie = "https://www.imdb.com/title/tt7919680/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=f0294795-5981-40c8-b642-15ce8ebdecf6&pf_rd_r=TMWN8SMV9FDE83TBCY2E&pf_rd_s=center-1&pf_rd_t=60601&pf_rd_i=india.toprated&ref_=fea_india_ss_toprated_india_tr_in_cap_pri_1";

(async () => {
    const response = await request({
        uri: movie,
        gzip: true,
        headers: {
            "accept": "text / html, application/ xhtml + xml, application/ xml; q = 0.9, image / webp, image / apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
        }
    });

    const $ = cheerio.load(response);

    const title = $(".title_wrapper > h1").text().trim();
    const rating = $(".ratingValue > strong > span").text();
    const director = $(".plot_summary > div:nth-child(2) > a").text();
    const summary = $(".plot_summary > .summary_text").text().trim();

    movieData.push({
        title,
        rating,
        director,
        summary
    });

    const json2csvParser = new json2csv();
    const csv = json2csvParser.parse(movieData);

    fs.writeFileSync("./scraped.csv", csv, "utf-8");
})();


