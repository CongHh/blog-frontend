// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const axios = require('axios')
const fs = require('fs')

const utcToLocal = (time) => {
  let formatNum = (num) => {
    return num >= 10 ? num : ('0' + num)
  }
  let arr = time.split(/[^0-9]/)
  let worldDate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
  let localDate = new Date(worldDate.getTime() + 8 * 60 * 60 * 1000)
  return formatNum(localDate.getFullYear()) + "-"
    + formatNum((localDate.getMonth() + 1)) + "-"
    + formatNum(localDate.getDate()) + " "
    + formatNum(localDate.getHours()) + ":"
    + formatNum(localDate.getMinutes()) + ":"
    + formatNum(localDate.getSeconds())
}

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/

    const collection = addCollection('newStatus');

    let rawdata = fs.readFileSync('static/configuration.json');
    let configuration = JSON.parse(rawdata);

    let blog = {}
    let loading = true
    let response = await axios.get(`https://api.github.com/users/${configuration.githubUsername}/gists?page=1&per_page=1`)
    let result = response.data;
    if (!result || result.length == 0) {
      loading = false;
    } else {
      for (let key in result[0].files) {
        blog.id = result[0]["id"];
        break;
      }
      response = await axios.get(`https://api.github.com/gists/${blog.id}`)
      result = response.data;
      if (!result || result.length == 0) {
        loading = false;
      } else {
        for (let key in result.files) {
          blog["title"] = key;
          blog["content"] = result.files[key]["content"];
          blog["description"] = result["description"];
          blog["createTime"] = utcToLocal(result["created_at"]);
          blog["updateTime"] = utcToLocal(result["updated_at"]);
          break;
        }
      }
    }

    collection.addNode({
      ...blog,
      loading,
    });
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
