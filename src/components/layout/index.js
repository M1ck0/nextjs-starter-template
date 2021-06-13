import { useEffect } from "react";

// NE BRISATI KOMPONENTU
const Layout = ({ children }) => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].style.visibility = "visible";
  }, [50]);

  return <>{children}</>;
};

export default Layout;
