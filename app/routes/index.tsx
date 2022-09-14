import { Hero } from "~/components/hero";
import { Header } from "~/components/header";

export default function Index() {
  return (
    <>
      <main className="">
        <div className="bg-gradient-to-br from-indigo-400 via-blue-600 to-cyan-500">
          <Header />
          <Hero />
        </div>
      </main>
    </>
  );
}
