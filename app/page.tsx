import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <Button>
        <Link href={"/login"}>Go to Login</Link>
      </Button>
    </div>
  );
};

export default Home;
