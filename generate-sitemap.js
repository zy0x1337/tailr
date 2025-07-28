const fs = require('fs');
const blogData = require('./blogData.json');
const petsData = require('./petsData.json');

const generateDynamicSitemap = () => {
  let urls = [];
  
  // Blog-Posts hinzufügen
  blogData.forEach(post => {
    urls.push(`https://tailr.netlify.app/blog/${post.slug}`);
  });
  
  // Haustier-Profile hinzufügen
  petsData.forEach(pet => {
    urls.push(`https://tailr.netlify.app/pets/${pet.id}`);
  });
  
  return urls;
};