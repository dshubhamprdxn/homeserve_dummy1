const moment = require('moment');
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAttrs = require('markdown-it-attrs');
const markdownItContainer = require('markdown-it-container');

moment.locale('en');


module.exports = function (config) {
  // Folders to copy to output folder
  config.addPassthroughCopy("css");
  config.addPassthroughCopy("assets");
  config.addPlugin(pluginNavigation);

  // Get date ISO format
  config.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });

  // Get readable formatted date, eg:  May 20, 2020
  config.addFilter('dateReadable', date => {
    return moment(date).format('LL'); 
  });

  // Configure excerpt seprator
  config.setFrontMatterParsingOptions({
    excerpt: true,
    // Any line before "<!-- excerpt -->" will be added as excerpt in data
    excerpt_alias: 'customExcerpt'
  });

  config.addCollection('post', function(collection) {
      return collection.getFilteredByGlob("coverages/*.md")
          .sort((a, b) => b.data.order - a.data.order);
  });

  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let markdownLib = markdownIt(options).use(markdownItAttrs)
    .use(markdownItContainer,'wrapper')
    .use(markdownItContainer,'cover-info')
    .use(markdownItContainer,'fact-container')
    .use(markdownItContainer,'details-holder')
    .use(markdownItContainer,'left-column')
    .use(markdownItContainer,'covered-holder')
    .use(markdownItContainer,'covered-title')
    .use(markdownItContainer,'covered-content')
    .use(markdownItContainer,'cover-det')
    .use(markdownItContainer,'cover-list')
    .use(markdownItContainer,'svg-eli')
    .use(markdownItContainer,'svg-nt-eli')
    .use(markdownItContainer,'svg-exc')
    .use(markdownItContainer,'ul-holder')
    .use(markdownItContainer,'product-small-print')
    .use(markdownItContainer,'see-more-less')
    .use(markdownItContainer,'product-faq')
    .use(markdownItContainer,'repair-mgmt-corp')
    .use(markdownItContainer,'need-help')
    .use(markdownItContainer,'need-help-container')
    .use(markdownItContainer,'need-help-description')
    .use(markdownItContainer,'need-help-image')
    .use(markdownItContainer,'homeserve-content')
    .use(markdownItContainer,'feature')
    .use(markdownItContainer,'feature-list')
    .use(markdownItContainer,'about-us')
    .use(markdownItContainer,'faq-heading')
    .use(markdownItContainer,'faq-content')
    .use(markdownItContainer,'right-column')
    .use(markdownItContainer,'right-panel')
    .use(markdownItContainer,'prod-dets')
    .use(markdownItContainer,'det-holder')
    .use(markdownItContainer,'post-image')
    .use(markdownItContainer,'price')
    .use(markdownItContainer,'cart-button')
    .use(markdownItContainer,'money-back-panel')
    .use(markdownItContainer,'money-back')
    .use(markdownItContainer,'money-img-holder')
    .use(markdownItContainer,'choose-panel')
    .use(markdownItContainer,'choose-panel-holder')
    .use(markdownItContainer,'prod-list')
    .use(markdownItContainer,'thanks-msg');

  config.setLibrary("md", markdownLib);

  return {
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  }


};
