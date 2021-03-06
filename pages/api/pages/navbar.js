import {Page} from '../../../models';

export default async (request, res) => {
  const {
    method
  } = request;

  if (method === 'GET') {
    const pages = await Page.findAll({attributes: {exclude: ['content']}, include: {all: true}});

    // Hoist/lower pages by hierarchy
    const topLevelPages = [
      {
        name: 'Movies',
        href: '/movies'
      },
      {
        name: 'Contact',
        href: '/pages/contact'
      },
      {
        name: 'Location',
        href: '/pages/location'
      }
    ];

    const pageFolders = {};

    pages.forEach(page => {
      if (page.PageCategoryId === null) {
        topLevelPages.push(page);
      } else {
        const category = page.PageCategory.name;

        if (pageFolders[category] === undefined) {
          pageFolders[category] = [page];
        } else {
          pageFolders[category].push(page);
        }
      }
    });

    res.json({pages: topLevelPages, folders: pageFolders});
  }
};
