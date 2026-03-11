import Link from "next/link";

const Home = () => {
  return (
    <div>
      <Link href={"/login"}>Go to Login</Link>
    </div>
  );
};

export default Home;
