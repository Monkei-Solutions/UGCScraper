import axios from "axios"
import fs from "fs"

let catalogUrl = "https://catalog.roblox.com/v1/search/items?category=CommunityCreations&limit=100&sortType=3&subcategory=CommunityCreations"
let ugcDump = []

function getAssets() {
    return new Promise(function(resolve, reject) {
        const response = axios.get(catalogUrl)
        resolve(response)
    })
}

async function start() {
    while (true) {
        const result = await getAssets()
        const assets = result.data.data

        assets.forEach(assetData => ugcDump.push(assetData));

        catalogUrl += catalogUrl.match("&cursor") ? "" : "&cursor=null"
        catalogUrl = catalogUrl.replace(/&cursor=([^;]+)/, result.data.nextPageCursor ? `&cursor=${result.data.nextPageCursor}` : "")

        if (!result.data.nextPageCursor) {console.log("scraped"); break;}
    }

    return ugcDump
}

start().then((response) => fs.writeFile("ugc.json", JSON.stringify(response), function(error) {
    if (error) throw error
}))