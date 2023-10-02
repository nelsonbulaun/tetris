import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import FortyLines from "./fortyLines";
import Survival from "./Survival";
import Layout from "./Layout";
import Home from "./Home";


const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/survival" element={<Survival />} />
        <Route path="/fortyLines" element={<FortyLines />}/>
      </Route>
      
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
