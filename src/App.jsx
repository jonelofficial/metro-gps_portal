import Routing from "./utility/Routing";
import "./style/index.scss";
import AppContext from "./context/AppContext";

const App = () => {
  return (
    <AppContext>
      <Routing />
    </AppContext>
  );
};

export default App;
