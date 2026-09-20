import { axios } from "axios";

function Home() {
  const data = axios.get("http://127.0.0.1:5000/api/test");
  return (
    <>
      <h1>From Home element</h1>
      <h1>{data}</h1>
    </>
  );
}

export default Home();
