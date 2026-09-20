import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/test")
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <h1>From Home element</h1>
      <h1>{data}</h1>
    </>
  );
}

export default Home;
