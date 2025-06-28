import HomePage from '../../views/pages/homePage';
import loginPage from '../../views/pages/loginPage';
import registerPage from '../../views/pages/registerPage';
import aboutPage from '../../views/pages/aboutPage';
import storyPage from '../../views/pages/storyPage';
import addStoryPage from '../../views/pages/addstoryPage';
import detailstoryPage from '../../views/pages/detailstoryPage';
import bookmarkPage from '../../views/pages/bookmarkPage';


const routes = {
  '/': new HomePage(),
  '/login': new loginPage(),
  '/register': new registerPage(),
  '/about': new aboutPage(),
  '/stories': new storyPage(),
  '/stories/add': new addStoryPage(),
  '/stories/:id': new detailstoryPage(),
  '/bookmark': new bookmarkPage,

};

const matchRoute = (path) => {
  if (routes[path]) {
    return routes[path];
  }
  if (path.startsWith("/stories/") && path.split("/").length === 3) {
    return routes["/stories/:id"];
  }

  return null;
};

export { routes as default, matchRoute };
