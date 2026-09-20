import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router"
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={
      <Home />
      }/>
      </Routes>
    </Router>
      <Home />
    </>
  );
}

export default App;
